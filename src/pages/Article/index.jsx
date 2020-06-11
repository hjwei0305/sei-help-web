import React, { Component } from 'react';
import marked from 'marked';
import highlight from 'highlight.js';
import SimpleMDE from 'simplemde';
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import markdown from '@/utils/markdown.js';
import 'simplemde/dist/simplemde.min.css';
import 'react-markdown-editor-lite/lib/index.css';

import "./index.less";
import './marked.css';
const mdParser = new MarkdownIt(/* Markdown-it options */);

class Article extends Component {

  state = {
    content: null,
  }

  componentWillMount() {
    // marked相关配置
    // marked.setOptions({
    //   renderer: new marked.Renderer(),
    //   gfm: true,
    //   tables: true,
    //   breaks: true,
    //   pedantic: false,
    //   sanitize: true,
    //   smartLists: true,
    //   smartypants: false,
    //   highlight: function(code) {
    //     return hljs.highlightAuto(code).value;
    //   },
    // });
  }

  componentDidMount() {
    // this.SimpleMDE = new SimpleMDE({
    //   element: document.getElementById('editor').childElementCount,
		// 	autofocus: true,
		// 	autosave: true,
		// 	previewRender(plainText) {
		// 		return marked(plainText, {
		// 			renderer: new marked.Renderer(),
		// 			gfm: true,
		// 			pedantic: false,
		// 			sanitize: false,
		// 			tables: true,
		// 			breaks: true,
		// 			smartLists: true,
		// 			smartypants: true,
		// 			highlight(code) {
		// 				return highlight.highlightAuto(code).value;
		// 			},
		// 		});
		// 	},
    // });
  }

  handleImageUpload = file => {
    console.log(file);
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = data => {
        resolve(data.target.result);
      };
      reader.readAsDataURL(file);
    });
  };

  handleEditorChange = ({html, text, }) => {

    markdown.marked(text).then(res => {
      this.setState({
        toc: res.toc,
      });

      console.log('handleEditorChange', html, text, res.toc);
    }) 
  }

  render() {
    const { content, toc, } = this.state;

    return (
      <div className="content">
        {/* <div
          id="content"
          className="article-detail"
          dangerouslySetInnerHTML={{
            __html: this.state.articleDetail.content ? marked(this.state.articleDetail.content) : null,
          }}
        /> */}
            <MdEditor
              value=""
              // renderHTML={(text) => mdParser.render(text)}
              renderHTML={(text) => mdParser.render(text)}
              onChange={this.handleEditorChange}
              onImageUpload={this.onImageUpload}
            />
        {/* <textarea id="editor" style={{ marginBottom: 20, width: 800 }} size="large" rows={6} /> */}
        { toc? (
                  <div
                  style={{ width: '23%' }}
                  className="article-right fr anchor"
                  dangerouslySetInnerHTML={{
                    __html: toc,
                  }}
                />
        ) : null}
      </div>
    );
  }
}

export default Article;