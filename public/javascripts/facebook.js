
window.fbAsyncInit = function() {
  FB.init({
    appId      : '674495872636198',
    cookie     : true,  // enable cookies
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.2'
  });
};

// Load the SDK
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
