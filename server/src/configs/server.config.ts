export default () => {
	return {
		port: process.env.PORT || 4000,
		host: process.env.HOST || 'http://localhost',
	};
};
