import nextra from 'nextra'

const withNextra = nextra({
  latex: true,
  search: {
    codeblocks: false
  },
  readingTime: true,
  contentDirBasePath: '/docs'
})

export default withNextra({
  // Ensure proper file handling
  pageExtensions: ['mdx', 'md', 'tsx', 'jsx', 'js'],
})
