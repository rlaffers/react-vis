import React from 'react'
import {graphql, StaticQuery} from 'gatsby'
import Blog from 'components/blog'

function CodingBlog(props) {
  return <Blog {...props} />
}

export default function CodingBlogWithData(props) {
  return (
    <StaticQuery
      query={graphql`
        query {
          allMdx(
            sort: {fields: [frontmatter___date], order: DESC}
            filter: {
              frontmatter: {published: {ne: false}, unlisted: {ne: true}}
              fileAbsolutePath: {regex: "//content/blog//"}
            }
          ) {
            edges {
              node {
                excerpt(pruneLength: 250)
                id
                fields {
                  title
                  slug
                  date
                }
                parent {
                  ... on File {
                    sourceInstanceName
                  }
                }
                frontmatter {
                  title
                  date(formatString: "MMMM DD, YYYY")
                  slug
                  keywords
                }
              }
            }
          }
        }
      `}
      render={data => <CodingBlog data={data} {...props} />}
    />
  )
}