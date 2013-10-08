/**
 * Reduces the number of untouched files being reprocessed by the watch task.
 */
module.exports = function(grunt, watchTargets) {
  var oldFilesName = 'oldFiles';

  var WatchFilesHelper = function(files) {
    return {
      getFiles: function () {
        return files;
      },

      getMatches: function (filepaths) {
        var matches = [];

        files.forEach(function (file) {
          var match = grunt.file.match({matchBase: true}, file.src, filepaths);
          if (match) {
            matches.push({'file': file, 'filepaths': match});
          }
        });

        console.log(this);

        return matches.length == 0 ? null : matches;
      }
    };
  };

  var reduceTaskFiles = function (necessaryFilepaths) {
    return function(taskName) {
      var configName = taskName.replace(':', '.'),
          filesConfigName = configName + '.files',
          oldFilesConfigName = configName + '.' + oldFilesName;

      // Clean up any previous changes to the task.
      if (grunt.config(oldFilesConfigName)) {
        // Overwrite the 'files' entry to the old one.
        grunt.config(filesConfigName, grunt.config(oldFilesConfigName));

        // Remove the old 'files' entry.
        var configObj = grunt.config(configName);
        delete configObj[oldFilesName];
      }

      var files = grunt.config(filesConfigName);

      // Compute the reduced list of src/dest file mappings for the task.
      var reducedFiles = [];
      WatchFilesHelper(files).getMatches(necessaryFilepaths).forEach(function (match) {
        var validExpandOptionKeys = ['flatten', 'ext', 'rename', 'filter'];

        // Copy (shallow) any relevant expandMapping() options from the file object.
        var expandOptions = {};
        validExpandOptionKeys.forEach(function (validKey) {
          if (match.file[validKey]) {
            expandOptions[validKey] = match.file[validKey];
          }
        });

        // Add expanded src/dest mappings to the list of files to be processed.
        reducedFiles = reducedFiles.concat(
          grunt.file.expandMapping(match.filepaths, match.file.dest, expandOptions)
        );
      });

      // Use the reduced, rather than the stock/default, list (if it could be created).
      if (reducedFiles && reducedFiles.length > 0) {
        grunt.config(oldFilesConfigName, files);
        grunt.config(filesConfigName, reducedFiles);
      }
    };
  };

  // Rebuild fewer files on watch task when possible.
  grunt.event.on('watch', function (action, filepath, target) {
    if (watchTargets.indexOf(target) != -1) {
        var tasks = grunt.config('watch.' + target + '.tasks');

        tasks.forEach(reduceTaskFiles(filepath));
    }
  });
};