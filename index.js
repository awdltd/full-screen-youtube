/**
 *  @class
 *  @function FullScreenYouTube
 *  @param {String} url - the URL appendage of the YouTube video
 *  @param {String} selector - the ID tag of the element
 *  @param {Element} container - OPTIONAL, the DOM wrapper for the banner
 */
export default class FullScreenYouTube {
  constructor(url, selector = 'video', container = false) {
    this.url = url;
    this.selector = selector;
    this.container = container;

    // Set aspect ratio of video (typically 16/9)
    this.ASPECT_RATIO = 16 / 9;

    // Check the provided element exists
    this._checkElementExists();
  }

  _checkElementExists() {
    // Error out if YouTube ID is not a string
    if (!this.url || !(typeof this.selector == 'string')) {
      throw new Error('[YouTubeBanner] No valid video URL was provided');
    }

    // Error out if element selector is not a string
    if (!this.selector || !(typeof this.selector == 'string')) {
      throw new Error('[YouTubeBanner] you did not provide a valid ID for the element');
    }

    // Load video
    this._loadYouTubeVideo();
  }

  _loadYouTubeVideo() {
    let firstScriptTag, player, tag;

    // Create YouTube API tag
    tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';

    // Append YouTube API tag to other script tags
    firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Play video when ready
    window.onYouTubeIframeAPIReady = () => {
      player = new YT.Player(this.selector, {
        videoId: this.url,
        playerVars: {
          modestbranding: 0,
          autoplay: 1,
          controls: 0,
          showinfo: 0,
          wmode: 'transparent',
          branding: 0,
          rel: 0,
          autohide: 0,
          mute: 1,
          origin: window.location.origin
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange
        }
      });
    };

    window.onPlayerReady = event => {
      event.target.playVideo();
      this.resizeVideoToContainer();
    };

    window.onPlayerStateChange = event => {
      if (event.data === YT.PlayerState.ENDED) {
        player.playVideo();
      }
    };
  }

  resizeVideoToContainer() {
    let aspect = this.ASPECT_RATIO;
    let element = document.getElementById(this.selector);
    let container = this.container;

    function resizeElement(){
      // Get container width and height
      let outerWidth = !container ? window.innerWidth : container.offsetWidth;
      let outerHeight = !container ? window.innerHeight : container.offsetHeight;

      // Get aspect ratio of container
      let checkRatio = outerWidth / outerHeight > aspect;

      // Get video placements and sizes
      element.style.width = (checkRatio ? outerWidth : outerHeight * aspect) + 'px';
      element.style.height = (checkRatio ? outerWidth / aspect : outerHeight) + 'px';
      element.style.left = (checkRatio ? 0 : (outerWidth / aspect - outerHeight) / 2) + 'px';
      element.style.top = (checkRatio ? (outerHeight * aspect - outerWidth) / 2 : 0) + 'px';
    }
    resizeElement();

    // Add event listeners
    window.addEventListener('resize', resizeElement);
    window.addEventListener('orientationchange', resizeElement);
  }
}
