To use this, create a folder and clone Giggle into it.

Open a terminal window ( I use Git Bash ) in the build folder and type 'npm install'
This will install all necessary packages.

Once the install is finished, type 'gulp build'
After the build is finished, type 'gulp' and a server with livereload will start. Go to localhost:8181 and start coding!

This uses Jade, SCSS, Angular and Bootstrap.

Always work out of the build folder and then use the files in the deploy folder for production.

You can also use the 'gulp deploy' task to load all files in the deploy folder to your hosting server via ftp. 
Just add your ftp credentials to the top of the gulp file and then type 'gulp deploy' when you are ready!

