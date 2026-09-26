window.HELP_IMPROVE_VIDEOJS = false;

$(document).ready(function() {
    var reduceMotion = false;
    try {
      reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {}

    var TASKS = {
      catch: {
        sim: './static/videos/task_catch_sim.mp4',
        real: './static/videos/task_catch_real.mp4',
        realRate: '19/30',
        simRate: '~90%',
        tabId: 'tab-catch'
      },
      intercept: {
        sim: './static/videos/task_intercept_sim.mp4',
        real: './static/videos/task_intercept_real.mp4',
        realRate: '23/30',
        simRate: '~91%',
        tabId: 'tab-intercept'
      },
      conveyor: {
        sim: './static/videos/task_conveyor_sim.mp4',
        real: './static/videos/task_conveyor_real.mp4',
        realRate: '30/30',
        simRate: '~97%',
        tabId: 'tab-conveyor'
      },
      movingbox: {
        sim: './static/videos/task_movingbox_sim.mp4',
        real: './static/videos/task_movingbox_real.mp4',
        realRate: '29/30',
        simRate: '~93%',
        tabId: 'tab-movingbox'
      }
    };

    var taskOrder = ['catch', 'intercept', 'conveyor', 'movingbox'];
    var simVideo = document.getElementById('task-sim');
    var realVideo = document.getElementById('task-real');
    var rateReal = document.getElementById('task-rate-real');
    var rateSim = document.getElementById('task-rate-sim');
    var taskPanel = document.getElementById('task-panel');
    var taskPicker = document.querySelector('.task-picker');
    var taskButtons = Array.prototype.slice.call(document.querySelectorAll('.task-option'));

    function setTask(name, opts) {
      var task = TASKS[name];
      if (!task) return;
      opts = opts || {};
      taskButtons.forEach(function(btn) {
        var active = btn.getAttribute('data-task') === name;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-selected', active ? 'true' : 'false');
        btn.tabIndex = 0;
      });
      if (taskPanel && task.tabId) {
        taskPanel.setAttribute('aria-labelledby', task.tabId);
      }
      if (simVideo) {
        simVideo.pause();
        simVideo.setAttribute('src', task.sim);
        simVideo.load();
        if (!reduceMotion) {
          var playSim = simVideo.play();
          if (playSim && playSim.catch) playSim.catch(function() {});
        }
      }
      if (realVideo) {
        realVideo.pause();
        realVideo.setAttribute('src', task.real);
        realVideo.load();
        if (!reduceMotion) {
          var playReal = realVideo.play();
          if (playReal && playReal.catch) playReal.catch(function() {});
        }
      }
      if (rateReal) rateReal.textContent = task.realRate;
      if (rateSim) rateSim.textContent = task.simRate;
      if (opts.focus) {
        var activeBtn = document.querySelector('.task-option[data-task="' + name + '"]');
        if (activeBtn) activeBtn.focus();
      }
    }

    if (taskPicker) {
      taskPicker.addEventListener('click', function(event) {
        var button = event.target.closest('.task-option');
        if (!button || !taskPicker.contains(button)) return;
        event.preventDefault();
        setTask(button.getAttribute('data-task'));
      });
    }

    taskButtons.forEach(function(button) {
      button.addEventListener('keydown', function(event) {
        var key = event.key;
        var idx = taskOrder.indexOf(button.getAttribute('data-task'));
        if (idx < 0) return;
        var next = idx;
        if (key === 'ArrowRight' || key === 'ArrowDown') {
          next = (idx + 1) % taskOrder.length;
        } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
          next = (idx - 1 + taskOrder.length) % taskOrder.length;
        } else if (key === 'Home') {
          next = 0;
        } else if (key === 'End') {
          next = taskOrder.length - 1;
        } else if (key === 'Enter' || key === ' ') {
          event.preventDefault();
          setTask(button.getAttribute('data-task'));
          return;
        } else {
          return;
        }
        event.preventDefault();
        setTask(taskOrder[next], { focus: true });
      });
    });

    var isPhone = window.matchMedia('(max-width: 700px)').matches;
    var options = {
      slidesToScroll: 1,
      slidesToShow: 3,
      loop: true,
      infinite: false,
      autoplay: !reduceMotion,
      autoplaySpeed: 7000,
      duration: reduceMotion ? 0 : 700,
      pauseOnHover: true,
      pagination: !isPhone,
      navigation: true,
      breakpoints: [
        { changePoint: 700, slidesToShow: 1, slidesToScroll: 1 },
        { changePoint: 1000, slidesToShow: 2, slidesToScroll: 1 },
        { changePoint: 1400, slidesToShow: 3, slidesToScroll: 1 },
        { changePoint: 1800, slidesToShow: 4, slidesToScroll: 1 }
      ]
    };

    try {
      bulmaCarousel.attach('#results-carousel', options);
    } catch (err) {
      console.warn('Carousel init failed', err);
    }

    if ('IntersectionObserver' in window) {
      var videoObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          var video = entry.target;
          if (entry.isIntersecting && !reduceMotion) {
            var playPromise = video.play();
            if (playPromise && playPromise.catch) playPromise.catch(function() {});
          } else {
            video.pause();
          }
        });
      }, { threshold: 0.25 });

      document.querySelectorAll('.compare-pane video, #task-sim, #task-real').forEach(function(video) {
        videoObserver.observe(video);
      });
    }
});
