window.HELP_IMPROVE_VIDEOJS = false;

$(document).ready(function() {
    var options = {
      slidesToScroll: 1,
      slidesToShow: 3,
      loop: true,
      infinite: false,
      autoplay: true,
      autoplaySpeed: 7000,
      duration: 700,
      pauseOnHover: true,
      breakpoints: [
        { changePoint: 640, slidesToShow: 1, slidesToScroll: 1 },
        { changePoint: 900, slidesToShow: 2, slidesToScroll: 1 },
        { changePoint: 1200, slidesToShow: 3, slidesToScroll: 1 }
      ]
    };

    bulmaCarousel.attach('#results-carousel', options);

    var TASKS = {
      catch: {
        sim: './static/videos/task_catch_sim.mp4',
        real: './static/videos/task_catch_real.mp4',
        realRate: '19/30',
        simRate: '~90%'
      },
      intercept: {
        sim: './static/videos/task_intercept_sim.mp4',
        real: './static/videos/task_intercept_real.mp4',
        realRate: '23/30',
        simRate: '~91%'
      },
      conveyor: {
        sim: './static/videos/task_conveyor_sim.mp4',
        real: './static/videos/task_conveyor_real.mp4',
        realRate: '30/30',
        simRate: '~97%'
      },
      movingbox: {
        sim: './static/videos/task_movingbox_sim.mp4',
        real: './static/videos/task_movingbox_real.mp4',
        realRate: '29/30',
        simRate: '~93%'
      }
    };

    var simVideo = document.getElementById('task-sim');
    var realVideo = document.getElementById('task-real');
    var rateReal = document.getElementById('task-rate-real');
    var rateSim = document.getElementById('task-rate-sim');
    var taskButtons = document.querySelectorAll('.task-option');

    function setTask(name) {
      var task = TASKS[name];
      if (!task) return;
      taskButtons.forEach(function(btn) {
        btn.classList.toggle('is-active', btn.getAttribute('data-task') === name);
      });
      if (simVideo) {
        simVideo.src = task.sim;
        simVideo.load();
        simVideo.play().catch(function() {});
      }
      if (realVideo) {
        realVideo.src = task.real;
        realVideo.load();
        realVideo.play().catch(function() {});
      }
      if (rateReal) rateReal.textContent = task.realRate;
      if (rateSim) rateSim.textContent = task.simRate;
    }

    taskButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        setTask(button.getAttribute('data-task'));
      });
    });

    if ('IntersectionObserver' in window) {
      var videoObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          var video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(function() {});
          } else {
            video.pause();
          }
        });
      }, { threshold: 0.25 });

      document.querySelectorAll('.compare-pane video, #task-sim, #task-real').forEach(function(video) {
        videoObserver.observe(video);
      });
    }
})
