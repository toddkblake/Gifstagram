# Gifstagram

[Gifstagram][gifs] is a single page gif exploration app inspired by Instagram created for demoing the [jDOM][link] library, a lightweight JavaScript library for manipulating the DOM inspired by jQuery.

Gifstagram allows you to:

- Explore trending gifs
- Search for gifs
- 'Like' gifs

[link]: [https://github.com/toddkblake/jDOM]
[gifs]: [https://github.com/toddkblake/jDOM]

## jDOM

Gifstagram relies solely on [jDOM][link] for all interactivity, including making AJAX requests to the Giphy API, a search bar, toggling likes and building post elements dynamically and appending them to the DOM.

```javascript
$j('form.giphy-search').on('submit', event => {
  event.preventDefault();

  const $input = $j('#query');
  const query = $input.val();
  const queryTerms = query.split(' ');
  $input.val('');

  searchGifs(queryTerms).then((gifs) => {
    $j('#feed').empty();

    gifs.data.forEach((gif) => {
      if (gif.user) {
        $post = buildPost(gif);
        $j('#feed').append($post);
      }
    });
  });
});
```
