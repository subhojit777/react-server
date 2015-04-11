var http = require('http'),
  browserify = require('browserify')
  literalify = require('literalify')
  React = require('react'),
  DOM = React.DOM, body = DOM.body, div = DOM.div, script = DOM.script,
  App = React.createFactory(require('./App'))

http.createServer(function(req, res) {
  if (req.url == '/') {
    res.setHeader('Content-Type', 'text/html')
    var props = {
      items: [
        'Item 0',
        'Item 1',
        'Item </script>',
        'Item <!--inject!-->',
      ]
    }

    var html = React.renderToStaticMarkup(body(null,
      div({id: 'content', dangerouslySetInnerHTML: {__html:
        React.renderToString(App(props))
      }}),
      script({dangerouslySetInnerHTML: {__html:
        'var APP_PROPS = ' + safeStringify(props) + ';'
      }}),
      script({src: '//fb.me/react-0.13.1.min.js'}),
      script({src: '/bundle.js'})
    ))

    res.end(html)
  } else if (req.url == '/bundle.js') {
    res.setHeader('Content-Type', 'text/javascript')
    browserify()
      .add('./browser.js')
      .transform(literalify.configure({react: 'window.React'}))
      .bundle()
      .pipe(res)
  } else {
    res.statusCode = 404
    res.end()
  }
}).listen(3000, function(err) {
  if (err) throw err
  console.log('Listening on 3000...')
})

function safeStringify(obj) {
  return JSON.stringify(obj).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
}
