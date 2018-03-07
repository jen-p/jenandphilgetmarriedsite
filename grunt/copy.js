module.exports = {
	build: {
		files: [{
			expand: true,
			src: [
				'js/*.js', '!js/site.js',
				'images/*', 
				'index.html',
				'contact.php'
			],
			dest: '_build'
		}]
	}
}