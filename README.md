# grunt-watch-helper

> Attempts to reduce unnecessary source file rebuilds in [watch](https://github.com/gruntjs/grunt-contrib-watch) tasks.

This will eventually be a proper Grunt plugin, but it's merely a CommonJS module until then.

## Getting started *(incomplete)*

Add this as a `npm` Git dependency.

## Examples *(incomplete)*

```javascript
grunt.initConfig({
  watch: {
    options: {
      spawn: false
    },
    less: {
      files: ['public/less/**'],
      tasks: ['less:development']
    }
  },
  
  less: {
    files: [
      {
        expand: true,
        cwd: 'public/less/',
        src: ['style.**.less'],
        dest: 'public/css/',
        rename: function(dest, src) {
          // Define extensions as the last '.', rather than the first.
          return dest + src.replace(/\.[\w]+$/, '.css');
        }
      }
    ],
  }
});


require('grunt-watch-helper')(grunt, ['less']);
```

## TODO
- [x] Determine if this is a spinoff personal project
- [ ] Turn this into a proper Grunt module
- [ ] Add tests!
- [ ] More configurability!
