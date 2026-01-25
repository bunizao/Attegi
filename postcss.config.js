/**
 * PostCSS Configuration for Attegi Theme
 * Processes compiled CSS with autoprefixer and cssnano
 */

module.exports = {
  plugins: [
    require('autoprefixer'),
    // Only minify in production
    ...(process.env.NODE_ENV === 'production'
      ? [require('cssnano')({ preset: 'default' })]
      : []
    )
  ]
};
