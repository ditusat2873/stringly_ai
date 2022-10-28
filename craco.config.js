module.exports = {
  style: {
    postOptions: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  resolve: {
    //   fallback: {
    //     "fs": false,
    //     "tls": false,
    //     "net": false,
    //     "http": require.resolve("stream-http"),
    //     "https": false,
    //     "zlib": require.resolve("browserify-zlib") ,
    //     "path": require.resolve("path-browserify"),
    //     "stream": require.resolve("stream-browserify"),
    //     "util": require.resolve("util/"),
           "crypto": require.resolve("crypto-browserify")
    } ,
}