module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      plugin: {
        src: ['lib/jquery-3.1.1.min.js', 'src/plugin/*.js'],
        dest: 'dist/lib/<%= pkg.name %>.plugin.min.js'
      },
      pluginOptions: {
        src: ['lib/jquery-3.1.1.min.js', 'src/options/*.js'],
        dest: 'dist/lib/<%= pkg.name %>.options.min.js'
      },
      background: {
        src: ['lib/jquery-3.1.1.min.js', 'src/background/*.js'],
        dest: 'dist/lib/<%= pkg.name %>.background.min.js'
      },
      content: {
        src: ['lib/jquery-3.1.1.min.js', 'src/content/*.js'],
        dest: 'dist/lib/<%= pkg.name %>.content.min.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          '<%= concat.plugin.dest %>': ['<%= concat.plugin.dest %>'],
          '<%= concat.pluginOptions.dest %>': ['<%= concat.pluginOptions.dest %>'],
          '<%= concat.background.dest %>': ['<%= concat.background.dest %>'],
          '<%= concat.content.dest %>': ['<%= concat.content.dest %>'],
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
      files: ['<%= jshint.files %>', 'pages/*.html'],
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
    copy: {
      main: {
        files: [
          { expand: true, src: ['pages/**'], dest: 'dist'},
          { expand: true, src: ['img/**'], dest: 'dist'},
          { expand: true, src: ['css/**'], dest: 'dist'},
          { expand: true, src: ['manifest.json'], dest: 'dist'}
        ]
      }
    },
    compress: {
      main: {
        options: {
          archive: 'deploy/<%= pkg.name %>.<%= pkg.version %>.zip'
        },
        files: [
          { expand: true, cwd: 'dist/', src: ['**'], dest: '.' }
        ]
      }
    },
    replace: {
      version: {
        options: {
          patterns: [
            { match: 'name', replacement: '<%= pkg.name %>' },
            { match: 'version', replacement: '<%= pkg.version %>' },
            { match: 'description', replacement: '<%= pkg.description %>' }
          ]
        },
        files: [
          { src: ['manifest.json'], dest: 'dist/' }
        ]
      }
    },
    clean: ['dist','deploy']
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-dev-prod-switch');

  grunt.registerTask('test', ['jshint', 'qunit']);

  grunt.registerTask('default', ['clean', 'dev_prod_switch', 'replace', 'jshint', 'qunit', 'concat', 'uglify', 'copy', 'replace', 'compress']);

};
