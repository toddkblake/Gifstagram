$j(() => {
  fetchTrendingGifs().then((gifs) => {
    gifs.data.forEach((gif) => {
      if (gif.user) {
        $post = buildPost(gif);
        $j('#feed').append($post);
      }
    });
  });
});

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

const toggleLike = likeElement => {
  $like = $j(likeElement);
  if (likeElement.classList.contains('red')) {
    $like.removeClass('fa-heart');
    $like.addClass('fa-heart-o');
    $like.removeClass('red');
  } else {
    $like.removeClass('fa-heart-o');
    $like.addClass('fa-heart');
    $like.addClass('red');
  }
}

const buildPost = gif => {
  const $div = $j(document.createElement('div'));
  $div.addClass('post');

  $header = buildHeader(gif);
  $div.append($header);

  const $img = $j(document.createElement('img'));
  $img.attr('src', gif.images.original.url);
  $div.append($img);

  const $like = $j(document.createElement('i'));
  $like.addClass('fa');
  $like.addClass('fa-heart-o');
  $like.addClass('like');
  $div.append($like);

  $like.on('click', event => {
    const like = event.currentTarget;
    toggleLike(like);
  });

  return $div;
}

const buildHeader = gif => {
  const $header = $j(document.createElement('div'));
  $header.addClass('post-header');

  const $user = $j(document.createElement('ul'));
  $user.addClass('user');

  const $avatar = $j(document.createElement('img'));
  $avatar.attr('src', gif.user.avatar_url);
  $user.append($avatar);

  const $username = $j(document.createElement('p'));
  $username.append(gif.user.username);
  $user.append($username);

  $header.append($user);
  return $header;
}

const searchGifs = queryTerms => {
  const queryString = queryTerms.join('+');
  return $j.ajax({
    method: 'GET',
    url: `https://api.giphy.com/v1/gifs/search?q=${queryString}&limit=10&api_key=dc6zaTOxFJmzC`
  })
}

const fetchTrendingGifs = () => {
  return $j.ajax({
    method: 'GET',
    url: 'https://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC'
  })
}
