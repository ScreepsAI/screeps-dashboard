import fs from 'fs-extra';
import path from 'path';

const mockBlog = (src) => {
	let mockData = {}
	const blogPath = './blog/dist'
	const files = fs.readdirSync(blogPath)
	files.forEach(item => mockData[path.join(src, item)] = JSON.parse(fs.readFileSync(path.join(blogPath, item))))
	return mockData
}

//export default mockBlog('/api/blog')

