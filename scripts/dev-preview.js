#!/usr/bin/env node

/**
 * Local Ghost theme preview server.
 * Renders the theme's Handlebars templates locally and fetches content from a
 * remote Ghost Content API, so template, CSS, and JS edits can reload together.
 */

const fs = require('fs');
const http = require('http');
const path = require('path');
const { URL } = require('url');
const Handlebars = require('handlebars');
const browserSync = require('browser-sync').create();

const ROOT = process.cwd();
const DEFAULT_PREVIEW_PORT = 3020;
const DEFAULT_RENDER_PORT = 3021;
const DEFAULT_POSTS_PER_PAGE = 8;
const ASSET_TYPES = {
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2'
};

loadEnvFile('.env');
loadEnvFile('.env.local');

const contentUrl = normalizeUrl(
  process.env.GHOST_CONTENT_API_URL ||
  process.env.GHOST_API_URL ||
  process.env.GHOST_DEV_URL ||
  process.env.GHOST_URL
);
const contentKey = process.env.GHOST_CONTENT_API_KEY || process.env.GHOST_API_KEY;
const previewPort = parsePort(process.env.DEV_PREVIEW_PORT, DEFAULT_PREVIEW_PORT);
const renderPort = parsePort(process.env.DEV_PREVIEW_RENDER_PORT, DEFAULT_RENDER_PORT);
const autoOpen = parseBoolean(process.env.DEV_PREVIEW_OPEN);

if (!contentUrl || !contentKey) {
  console.error('\n[preview] Missing Ghost Content API config.');
  console.error('[preview] Set GHOST_CONTENT_API_URL and GHOST_CONTENT_API_KEY, then run bun run dev:preview.\n');
  process.exit(1);
}

const api = createGhostApi(contentUrl, contentKey);
const packageConfig = readJson('package.json');
const themeCustom = packageConfig.config && packageConfig.config.custom ? packageConfig.config.custom : {};
const postsPerPage = Number(packageConfig.config && packageConfig.config.posts_per_page) || DEFAULT_POSTS_PER_PAGE;

registerPartials();
registerHelpers();

const renderServer = http.createServer((request, response) => {
  handleRequest(request, response).catch((error) => {
    console.error('[preview] Render failed:', error);
    sendHtml(response, 500, renderErrorPage(error));
  });
});

renderServer.listen(renderPort, '127.0.0.1', () => {
  browserSync.init(
    {
      proxy: `http://127.0.0.1:${renderPort}`,
      port: previewPort,
      open: autoOpen,
      notify: false,
      ghostMode: false,
      injectChanges: true,
      ui: false,
      files: [
        'assets/css/**/*.css',
        'assets/js/**/*.js',
        '*.hbs',
        'partials/**/*.hbs',
        'locales/**/*.json'
      ],
      reloadDebounce: 120,
      logPrefix: 'preview'
    },
    (error) => {
      if (error) {
        console.error('[preview] Failed to start BrowserSync:', error.message);
        process.exit(1);
      }
    }
  );

  console.log('\n========================================');
  console.log('  Attegi Local Preview');
  console.log('========================================');
  console.log(`  Content API: ${contentUrl}`);
  console.log(`  Preview URL: http://localhost:${previewPort}`);
  console.log(`  Renderer:    http://127.0.0.1:${renderPort}`);
  console.log('  Watching:    assets + hbs + locales');
  console.log('========================================\n');
});

function loadEnvFile(fileName) {
  const filePath = path.join(ROOT, fileName);
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const equalsIndex = trimmed.indexOf('=');
    if (equalsIndex === -1) return;

    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  });
}

function normalizeUrl(rawUrl) {
  const value = String(rawUrl || '').trim().replace(/\/+$/, '');
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

function parsePort(rawPort, fallback) {
  const parsed = Number.parseInt(String(rawPort || ''), 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function parseBoolean(rawValue) {
  return ['1', 'true', 'yes', 'on'].includes(String(rawValue || '').trim().toLowerCase());
}

function readJson(fileName) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, fileName), 'utf8'));
}

function fillCountTemplate(template, value) {
  return String(template).split('%').join(String(value));
}

function createGhostApi(siteUrl, key) {
  async function request(resource, params = {}) {
    const apiUrl = new URL(`${siteUrl}/ghost/api/content/${resource.replace(/^\/+/, '')}`);
    apiUrl.searchParams.set('key', key);
    Object.entries(params).forEach(([param, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        apiUrl.searchParams.set(param, String(value));
      }
    });

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Ghost API ${response.status} for ${apiUrl.pathname}`);
    }
    return response.json();
  }

  return {
    siteUrl,
    settings: () => request('settings/'),
    posts: (params) => request('posts/', params),
    postBySlug: (slug) => request(`posts/slug/${encodeURIComponent(slug)}/`, { include: 'tags,authors' }),
    pages: (params) => request('pages/', params),
    pageBySlug: (slug) => request(`pages/slug/${encodeURIComponent(slug)}/`, { include: 'tags,authors' }),
    tags: (params) => request('tags/', params),
    tagBySlug: (slug) => request(`tags/slug/${encodeURIComponent(slug)}/`),
    authors: (params) => request('authors/', params),
    authorBySlug: (slug) => request(`authors/slug/${encodeURIComponent(slug)}/`)
  };
}

async function handleRequest(request, response) {
  const requestUrl = new URL(request.url, `http://localhost:${previewPort}`);
  const pathname = normalizePathname(requestUrl.pathname);

  if (pathname.startsWith('/assets/')) {
    serveAsset(pathname, response);
    return;
  }

  if (pathname === '/favicon.ico') {
    response.writeHead(204, { 'Cache-Control': 'no-store' });
    response.end();
    return;
  }

  const model = await buildRouteModel(pathname);
  sendHtml(response, model.status || 200, await renderRoute(model));
}

function normalizePathname(pathname) {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '') || '/';
}

function serveAsset(pathname, response) {
  const assetPath = path.normalize(path.join(ROOT, pathname));
  if (!assetPath.startsWith(path.join(ROOT, 'assets'))) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  if (!fs.existsSync(assetPath) || !fs.statSync(assetPath).isFile()) {
    response.writeHead(404);
    response.end('Not found');
    return;
  }

  const ext = path.extname(assetPath).toLowerCase();
  response.writeHead(200, {
    'Content-Type': ASSET_TYPES[ext] || 'application/octet-stream',
    'Cache-Control': 'no-store'
  });
  fs.createReadStream(assetPath).pipe(response);
}

async function buildRouteModel(pathname) {
  const common = await getCommonContext(pathname);

  if (pathname === '/') {
    const page = 1;
    const posts = await listPosts({ page, limit: postsPerPage });
    return {
      ...common,
      routeType: 'home',
      template: 'index',
      posts: posts.items,
      pagination: buildPagination(posts.meta.pagination, '/')
    };
  }

  const pageMatch = pathname.match(/^\/page\/(\d+)$/);
  if (pageMatch) {
    const page = Number(pageMatch[1]);
    const posts = await listPosts({ page, limit: postsPerPage });
    return {
      ...common,
      routeType: 'home',
      template: 'index',
      posts: posts.items,
      pagination: buildPagination(posts.meta.pagination, '/')
    };
  }

  const tagMatch = pathname.match(/^\/tag\/([^/]+)(?:\/page\/(\d+))?$/);
  if (tagMatch) {
    const slug = decodeURIComponent(tagMatch[1]);
    const page = Number(tagMatch[2] || 1);
    const [tagData, posts] = await Promise.all([
      api.tagBySlug(slug),
      listPosts({ filter: `tag:${slug}`, limit: postsPerPage, page })
    ]);
    return {
      ...common,
      routeType: 'tag',
      template: 'tag',
      tag: decorateTag(tagData.tags[0], common.site.url),
      posts: posts.items,
      pagination: buildPagination(posts.meta.pagination, `/tag/${slug}/`)
    };
  }

  const authorMatch = pathname.match(/^\/author\/([^/]+)(?:\/page\/(\d+))?$/);
  if (authorMatch) {
    const slug = decodeURIComponent(authorMatch[1]);
    const page = Number(authorMatch[2] || 1);
    const [authorData, posts] = await Promise.all([
      api.authorBySlug(slug),
      listPosts({ filter: `author:${slug}`, limit: postsPerPage, page })
    ]);
    return {
      ...common,
      routeType: 'author',
      template: 'author',
      author: decorateAuthor(authorData.authors[0], common.site.url),
      posts: posts.items,
      pagination: buildPagination(posts.meta.pagination, `/author/${slug}/`)
    };
  }

  const slug = pathname.slice(1);
  const page = await maybe(() => api.pageBySlug(slug));
  if (page && page.pages && page.pages[0]) {
    const pageModel = decoratePost(page.pages[0], common.site.url, true);
    return {
      ...common,
      ...pageModel,
      routeType: 'page',
      template: selectPageTemplate(pageModel),
      post: pageModel,
      page: { show_title_and_feature_image: true }
    };
  }

  const post = await maybe(() => api.postBySlug(slug));
  if (post && post.posts && post.posts[0]) {
    const postModel = decoratePost(post.posts[0], common.site.url, false);
    const navPosts = await listPosts({ limit: 20 });
    const navIndex = navPosts.items.findIndex((item) => item.slug === postModel.slug);
    return {
      ...common,
      ...postModel,
      routeType: 'post',
      template: 'post',
      post: postModel,
      nextPost: navIndex >= 0 ? navPosts.items[navIndex - 1] : null,
      prevPost: navIndex >= 0 ? navPosts.items[navIndex + 1] : null,
      collections: {
        posts: navPosts.items
      }
    };
  }

  return {
    ...common,
    routeType: 'error',
    template: 'error',
    status: 404,
    error: {
      statusCode: 404,
      message: 'Page not found'
    }
  };
}

async function getCommonContext(pathname) {
  const settings = await api.settings();
  const site = buildSite(settings.settings || {});
  const custom = buildCustomSettings();

  site.url = `http://localhost:${previewPort}`;
  site.navigation = decorateNavigation(site.navigation || [], pathname, site.url);

  return {
    site,
    custom,
    currentPath: pathname,
    collections: {},
    member: null,
    hideSubscribeButton: false
  };
}

function buildSite(settings) {
  return {
    title: settings.title || 'Ghost',
    description: settings.description || '',
    url: api.siteUrl,
    locale: settings.locale || 'en',
    logo: absolutizeUrl(settings.logo, api.siteUrl),
    icon: absolutizeUrl(settings.icon, api.siteUrl),
    cover_image: absolutizeUrl(settings.cover_image, api.siteUrl),
    twitter: settings.twitter || '',
    facebook: settings.facebook || '',
    members_enabled: Boolean(settings.members_enabled),
    members_invite_only: Boolean(settings.members_invite_only),
    navigation: settings.navigation || []
  };
}

function buildCustomSettings() {
  const custom = {};
  Object.entries(themeCustom).forEach(([key, config]) => {
    custom[key] = config && Object.prototype.hasOwnProperty.call(config, 'default') ? config.default : '';
  });
  return custom;
}

async function listPosts(params = {}) {
  const data = await api.posts({
    include: params.include || 'tags,authors',
    filter: params.filter,
    limit: params.limit || postsPerPage,
    page: params.page || 1,
    order: params.order || 'published_at desc'
  });

  return {
    items: (data.posts || []).map((post) => decoratePost(post, api.siteUrl, false)),
    meta: data.meta || { pagination: {} }
  };
}

function buildPagination(pagination, basePath) {
  return {
    page: pagination.page || 1,
    pages: pagination.pages || 1,
    total: pagination.total || 0,
    limit: pagination.limit || postsPerPage,
    next: pagination.next || null,
    prev: pagination.prev || null,
    basePath
  };
}

function decorateNavigation(items, currentPath, siteUrl) {
  return items.map((item) => {
    const itemUrl = item.url || '/';
    const url = itemUrl.startsWith('http') ? itemUrl : new URL(itemUrl, siteUrl).toString();
    const parsed = new URL(url);
    const itemPath = normalizePathname(parsed.pathname);
    return {
      ...item,
      url,
      slug: slugify(item.label || itemPath),
      current: itemPath === currentPath
    };
  });
}

function decoratePost(post, siteUrl, isPage) {
  const tags = (post.tags || []).map((tag) => decorateTag(tag, siteUrl));
  const authors = (post.authors || []).map((author) => decorateAuthor(author, siteUrl));
  const urlPath = isPage ? `/${post.slug}/` : `/${post.slug}/`;
  const html = absolutizeContentAssets(post.html || '', siteUrl);

  return {
    ...post,
    html,
    url: urlPath,
    canonical_url: new URL(urlPath, siteUrl).toString(),
    feature_image: absolutizeUrl(post.feature_image, siteUrl),
    tags,
    authors,
    primary_tag: tags[0] || null,
    primary_author: authors[0] || null,
    comments: false,
    reading_time: post.reading_time || readingTime(html)
  };
}

function decorateTag(tag, siteUrl) {
  if (!tag) return null;
  return {
    ...tag,
    url: `/tag/${tag.slug}/`,
    feature_image: absolutizeUrl(tag.feature_image, siteUrl)
  };
}

function decorateAuthor(author, siteUrl) {
  if (!author) return null;
  return {
    ...author,
    url: `/author/${author.slug}/`,
    profile_image: absolutizeUrl(author.profile_image, siteUrl),
    cover_image: absolutizeUrl(author.cover_image, siteUrl)
  };
}

function selectPageTemplate(page) {
  if (page.slug === 'tags' && templateExists('page-tags')) return 'page-tags';
  if (page.slug === 'links' && templateExists('page-links')) return 'page-links';
  return 'page';
}

function templateExists(name) {
  return fs.existsSync(path.join(ROOT, `${name}.hbs`));
}

async function renderRoute(model) {
  const collections = await buildCollections(model);
  const context = {
    ...model,
    '@site': model.site,
    '@custom': model.custom,
    __blocks: {},
    collections
  };
  const data = buildHandlebarsData(model, context);
  const body = compileTemplate(model.template)(context, { data });
  const layoutContext = {
    ...context,
    body: new Handlebars.SafeString(body)
  };
  return compileTemplate('default')(layoutContext, { data: buildHandlebarsData(model, layoutContext) });
}

async function buildCollections(model) {
  const collections = { ...(model.collections || {}) };

  if (model.template === 'page-tags') {
    const tagData = await api.tags({
      include: 'count.posts',
      filter: 'visibility:public',
      limit: 100,
      order: 'created_at desc'
    });
    collections.tags = (tagData.tags || []).map((tag) => decorateTag(tag, api.siteUrl));
    collections.postsByTag = {};

    await Promise.all(collections.tags.map(async (tag) => {
      const posts = await listPosts({ filter: `tag:${tag.slug}`, limit: 10 });
      collections.postsByTag[tag.slug] = posts.items;
    }));
  }

  if (!collections.posts) {
    const posts = await listPosts({ limit: 10 });
    collections.posts = posts.items;
  }

  return collections;
}

function buildHandlebarsData(model, root) {
  return {
    root,
    site: model.site,
    custom: model.custom,
    page: model.page || {},
    member: model.member,
    routeType: model.routeType,
    currentPath: model.currentPath
  };
}

function compileTemplate(name) {
  let source = fs.readFileSync(path.join(ROOT, `${name}.hbs`), 'utf8');
  source = source.replace(/^\s*\{\{!<\s+default\s*\}\}\s*/, '');
  return Handlebars.compile(source, { noEscape: false });
}

function registerPartials() {
  const partialRoot = path.join(ROOT, 'partials');
  const files = walk(partialRoot).filter((file) => file.endsWith('.hbs'));
  files.forEach((file) => {
    const name = path.relative(partialRoot, file).replace(/\.hbs$/, '').split(path.sep).join('/');
    Handlebars.registerPartial(name, Handlebars.compile(fs.readFileSync(file, 'utf8')));
  });
}

function registerHelpers() {
  Handlebars.registerHelper('asset', (assetPath) => `/assets/${String(assetPath || '').replace(/^\/+/, '')}`);
  Handlebars.registerHelper('t', translate);
  Handlebars.registerHelper('encode', (value) => encodeURIComponent(String(value || '')));
  Handlebars.registerHelper('img_url', imageUrl);
  Handlebars.registerHelper('date', dateHelper);
  Handlebars.registerHelper('foreach', foreachHelper);
  Handlebars.registerHelper('post', contextBlock('post'));
  Handlebars.registerHelper('author', contextBlock('author'));
  Handlebars.registerHelper('tag', contextBlock('tag'));
  Handlebars.registerHelper('primary_author', contextBlock('primary_author'));
  Handlebars.registerHelper('next_post', contextBlock('nextPost'));
  Handlebars.registerHelper('prev_post', contextBlock('prevPost'));
  Handlebars.registerHelper('contentFor', contentForHelper);
  Handlebars.registerHelper('block', blockHelper);
  Handlebars.registerHelper('is', isHelper);
  Handlebars.registerHelper('has', hasHelper);
  Handlebars.registerHelper('match', matchHelper);
  Handlebars.registerHelper('plural', pluralHelper);
  Handlebars.registerHelper('url', urlHelper);
  Handlebars.registerHelper('page_url', pageUrlHelper);
  Handlebars.registerHelper('pagination', paginationHelper);
  Handlebars.registerHelper('navigation', navigationHelper);
  Handlebars.registerHelper('tags', tagsHelper);
  Handlebars.registerHelper('content', contentHelper);
  Handlebars.registerHelper('excerpt', excerptHelper);
  Handlebars.registerHelper('post_class', postClassHelper);
  Handlebars.registerHelper('body_class', bodyClassHelper);
  Handlebars.registerHelper('meta_title', metaTitleHelper);
  Handlebars.registerHelper('reading_time', readingTimeHelper);
  Handlebars.registerHelper('comment_count', () => '0 comments');
  Handlebars.registerHelper('comments', () => '');
  Handlebars.registerHelper('ghost_head', ghostHeadHelper);
  Handlebars.registerHelper('ghost_foot', () => '');
  Handlebars.registerHelper('subscribe_form', subscribeFormHelper);
  Handlebars.registerHelper('get', getHelper);
}

function translate(phrase, options) {
  let output = String(phrase || '');
  Object.entries(options.hash || {}).forEach(([key, value]) => {
    output = output.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  });
  return output;
}

function imageUrl(image, options) {
  const url = absolutizeUrl(image, api.siteUrl);
  if (!url) return '';

  const hash = options && options.hash ? options.hash : {};
  if (hash.absolute === 'true' || hash.absolute === true) {
    return url;
  }
  return url;
}

function dateHelper(value, options) {
  let dateValue = value;
  let hash = options && options.hash ? options.hash : {};

  if (arguments.length === 1 || (options && options.name === 'date')) {
    dateValue = this.published_at || this.created_at || new Date();
    hash = value && value.hash ? value.hash : {};
  }

  const date = new Date(dateValue || new Date());
  const format = hash.format || 'MMM DD, YYYY';

  if (format === 'YYYY') return String(date.getFullYear());
  if (format === 'YYYY-MM-DD') return date.toISOString().slice(0, 10);
  if (format === 'x') return String(date.getTime());
  if (format === 'MMM D') return formatDate(date, { month: 'short', day: 'numeric' });
  if (format === 'MMM DD, YYYY') return formatDate(date, { month: 'short', day: '2-digit', year: 'numeric' });
  if (format === 'MMMM DD, YYYY') return formatDate(date, { month: 'long', day: '2-digit', year: 'numeric' });
  return formatDate(date, { month: 'short', day: '2-digit', year: 'numeric' });
}

function formatDate(date, options) {
  return new Intl.DateTimeFormat('en', options).format(date);
}

function foreachHelper(collection, options) {
  const items = Array.isArray(collection) ? collection : [];
  const limit = Number(options.hash && options.hash.limit) || items.length;
  const visibleItems = items.slice(0, limit);

  if (!visibleItems.length) {
    return options.inverse ? options.inverse(this) : '';
  }

  return visibleItems.map((item, index) => {
    const data = Handlebars.createFrame(options.data || {});
    data.index = index;
    data.first = index === 0;
    data.last = index === visibleItems.length - 1;
    return options.fn(item, { data });
  }).join('');
}

function contextBlock(key) {
  return function contextBlockHelper(options) {
    const root = options.data.root || {};
    const value = this[key] || root[key] || null;
    if (value) {
      return options.fn(value);
    }
    return options.inverse ? options.inverse(this) : '';
  };
}

function contentForHelper(name, options) {
  const root = options.data.root;
  root.__blocks = root.__blocks || {};
  root.__blocks[name] = (root.__blocks[name] || '') + options.fn(this);
  return '';
}

function blockHelper(name, options) {
  const root = options.data.root || {};
  return new Handlebars.SafeString(root.__blocks && root.__blocks[name] ? root.__blocks[name] : '');
}

function isHelper(routeType, options) {
  const current = options.data.routeType;
  const wanted = String(routeType || '').split(',').map((item) => item.trim());
  return wanted.includes(current) ? options.fn(this) : options.inverse(this);
}

function hasHelper(options) {
  const tagName = options.hash && options.hash.tag;
  if (!tagName) return options.inverse(this);

  const normalized = String(tagName).replace(/^#/, '');
  const tags = this.tags || [];
  const found = tags.some((tag) => tag.slug === normalized || tag.name === tagName || tag.name === normalized);
  return found ? options.fn(this) : options.inverse(this);
}

function matchHelper(left, operator, right, options) {
  let result = false;
  switch (operator) {
    case '!=':
    case '!==':
      result = left !== right;
      break;
    case '==':
    case '===':
      result = left === right;
      break;
    default:
      result = left === operator;
      break;
  }
  return result ? options.fn(this) : options.inverse(this);
}

function pluralHelper(count, options) {
  const value = Number(count) || 0;
  const hash = options.hash || {};
  if (value === 0) return hash.empty || '';
  const template = value === 1 ? (hash.singular || '%') : (hash.plural || '%');
  return fillCountTemplate(template, value);
}

function urlHelper(options) {
  const itemUrl = this.url || '/';
  if (options.hash && (options.hash.absolute === 'true' || options.hash.absolute === true)) {
    return new URL(itemUrl, api.siteUrl).toString();
  }
  return itemUrl;
}

function pageUrlHelper(page, options) {
  const root = options.data.root || {};
  const pagination = root.pagination || {};
  if (Number(page) <= 1) return pagination.basePath || '/';
  return `${pagination.basePath || '/'}page/${page}/`;
}

function paginationHelper(options) {
  return new Handlebars.SafeString(Handlebars.partials.pagination(options.data.root.pagination || {}, { data: options.data }));
}

function navigationHelper(options) {
  const root = options.data.root || {};
  return new Handlebars.SafeString(Handlebars.partials.navigation({ navigation: root.site.navigation || [] }, { data: options.data }));
}

function tagsHelper(options) {
  const tags = (this.tags || []).filter((tag) => tag.visibility !== 'internal');
  const separator = options.hash && options.hash.separator !== undefined ? options.hash.separator : ', ';
  return new Handlebars.SafeString(tags.map((tag) => `<a href="${tag.url}">${escapeHtml(tag.name)}</a>`).join(separator));
}

function contentHelper() {
  return new Handlebars.SafeString(this.html || this.content || '');
}

function excerptHelper(options) {
  const hash = options.hash || {};
  let text = this.excerpt || stripHtml(this.html || '');

  if (hash.words) {
    text = text.split(/\s+/).filter(Boolean).slice(0, Number(hash.words)).join(' ');
  }

  if (hash.characters) {
    text = text.slice(0, Number(hash.characters));
  }

  return text;
}

function postClassHelper() {
  const classes = ['post'];
  if (this.featured) classes.push('featured');
  if (this.page) classes.push('page');
  if (this.tags) {
    this.tags.slice(0, 3).forEach((tag) => classes.push(`tag-${tag.slug}`));
  }
  return classes.join(' ');
}

function bodyClassHelper(options) {
  const routeType = options.data.routeType;
  return routeType ? `${routeType}-template` : '';
}

function metaTitleHelper(options) {
  const root = options.data.root || {};
  if (root.title) return root.title;
  if (root.tag && root.tag.name) return root.tag.name;
  if (root.author && root.author.name) return root.author.name;
  return root.site ? root.site.title : 'Ghost';
}

function readingTimeHelper(options) {
  const minutes = this.reading_time || readingTime(this.html || '');
  const hash = options.hash || {};
  if (minutes === 1 && hash.minute) return hash.minute;
  if (hash.minutes) return fillCountTemplate(hash.minutes, minutes);
  return `${minutes} min read`;
}

function ghostHeadHelper(options) {
  const root = options.data.root || {};
  const title = escapeHtml(metaTitleHelper(options));
  return new Handlebars.SafeString(`<meta name="generator" content="Attegi local preview"><meta property="og:title" content="${title}">`);
}

function subscribeFormHelper(options) {
  const hash = options.hash || {};
  const formClass = hash.form_class || 'subscribe-form';
  const inputClass = hash.input_class || 'subscribe-input';
  const buttonClass = hash.button_class || 'subscribe-button';
  const placeholder = hash.placeholder || 'Your email address';
  return new Handlebars.SafeString(
    `<form class="${formClass}" data-preview-disabled><input class="${inputClass}" type="email" placeholder="${escapeHtml(placeholder)}" disabled><button class="${buttonClass}" type="button" disabled>Subscribe</button></form>`
  );
}

function getHelper(resource, options) {
  const root = options.data.root || {};
  const collections = root.collections || {};
  const hash = options.hash || {};

  if (resource === 'tags') {
    return options.fn({ tags: collections.tags || [] });
  }

  if (resource === 'posts') {
    const filter = interpolateFilter(hash.filter || '', this);
    let posts = collections.posts || [];
    const tagMatch = filter.match(/^tag:(.+)$/);
    if (tagMatch && collections.postsByTag) {
      posts = collections.postsByTag[tagMatch[1]] || [];
    }
    const limit = Number(hash.limit) || posts.length;
    return options.fn({ posts: posts.slice(0, limit) });
  }

  return options.inverse ? options.inverse(this) : '';
}

function interpolateFilter(filter, context) {
  return String(filter).replace(/\{\{slug\}\}/g, context.slug || '');
}

function renderErrorPage(error) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>Attegi preview error</title></head><body><pre>${escapeHtml(error.stack || error.message)}</pre></body></html>`;
}

function sendHtml(response, status, html) {
  response.writeHead(status, {
    'Content-Type': 'text/html; charset=UTF-8',
    'Cache-Control': 'no-store'
  });
  response.end(html);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(entryPath) : entryPath;
  });
}

function absolutizeUrl(value, siteUrl) {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  return new URL(value, siteUrl).toString();
}

function absolutizeContentAssets(html, siteUrl) {
  return String(html || '').replace(/(src|href)="\/(?!\/)/g, `$1="${siteUrl}/`);
}

function readingTime(html) {
  const text = stripHtml(html);
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function stripHtml(html) {
  return String(html || '').replace(/<[^>]+>/g, ' ');
}

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function maybe(fn) {
  return fn().catch((error) => {
    if (/Ghost API 404/.test(error.message)) return null;
    throw error;
  });
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function shutdown() {
  browserSync.exit();
  renderServer.close(() => process.exit(0));
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
