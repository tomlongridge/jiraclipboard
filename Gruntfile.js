module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      plugin: {
        src: ['src/plugin/*.js'],
        dest: 'dist/<%= pkg.name %>.plugin.js'
      },
      pluginOptions: {
        src: ['src/options/*.js'],
        dest: 'dist/<%= pkg.name %>.options.js'
      },
      background: {
        src: ['src/background/*.js'],
        dest: 'dist/<%= pkg.name %>.background.js'
      },
      content: {
        src: ['src/content/*.js'],
        dest: 'dist/<%= pkg.name %>.content.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.plugin.min.js': ['<%= concat.plugin.dest %>'],
          'dist/<%= pkg.name %>.options.min.js': ['<%= concat.options.dest %>'],
          'dist/<%= pkg.name %>.background.min.js': ['<%= concat.background.dest %>'],
          'dist/<%= pkg.name %>.content.min.js': ['<%= concat.content.dest %>'],
        }
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    jshint: {
      files: ['Gruntfile.js', 'manifest.json', 'src/**/*.js', 'test/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'qunit']
    },
    dev_prod_switch: {
        options: {
            environment: grunt.option('env') || 'dev',
            env_char: '#',
            env_block_dev: 'env:dev',
            env_block_prod: 'env:prod'
        },
        dynamic_mappings: {
          files: [{
              expand: true,
              cwd: '.',
              src: ['pages/*.html','manifest.json'],
              dest: '.'
          }]
        }
    },
    clean: ['dist']
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-dev-prod-switch');

  grunt.registerTask('test', ['jshint', 'qunit']);

  grunt.registerTask('default', ['clean', 'dev_prod_switch', 'jshint', 'qunit', 'concat', 'uglify']);

};
