#### markdown catalog generator

---

`md.md`
```md
# welcome
to the world
## hello
### hi
### hihi
# world
...
```

---

```js
require('jquery', 'markdown', 'Cataloger', function($, MD, Cataloger) {
  $.ajax({
    url: 'path/md.md'
  }).then(function(doc) {
    var $md = $('<div>');
    $md.html(MD.toHTML(doc));

    var $catalog = (new Cataloger($md.children())).parse();
    ///----------- $catalog
    /// ul
    ///   li
    ///     a(href='#1') welcom
    ///     ul
    ///       li
    ///         a'#1-1' hello
    ///         ul
    ///           li a'#1-1-1' hi
    ///           li a'#1-1-2' hihi
    ///   li a'#2' world
    ///
    ///----------- $md.children:
    /// h1#1 welcome
    /// p to the world
    /// h2#1-1 hello
    /// h3#1-1-1 hi
    /// h3#1-1-2 hihi
    /// h1#world
    /// 
  })
});
```
