window.HELP_IMPROVE_VIDEOJS = false;

$(document).ready(function() {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var options = {
      slidesToScroll: 1,
      slidesToShow: 3,
      loop: true,
      infinite: false,
      autoplay: !reduceMotion,
      autoplaySpeed: 7000,
      duration: reduceMotion ? 0 : 700,
      pauseOnHover: true,
      breakpoints: [
        { changePoint: 700, slidesToShow: 1, slidesToScroll: 1 },
        { changePoint: 1000, slidesToShow: 2, slidesToScroll: 1 },
        { changePoint: 1400, slidesToShow: 3, slidesToScroll: 1 },
        { changePoint: 1800, slidesToShow: 4, slidesToScroll: 1 }
      ]
    };

    bulmaCarousel.attach('#results-carousel', options);

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
    var taskButtons = Array.prototype.slice.call(document.querySelectorAll('.task-option'));

    function setTask(name, opts) {
      var task = TASKS[name];
      if (!task) return;
      opts = opts || {};
      taskButtons.forEach(function(btn) {
        var active = btn.getAttribute('data-task') === name;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-selected', active ? 'true' : 'false');
        btn.setAttribute('tabindex', active ? '0' : '-1');
      });
      if (taskPanel && task.tabId) {
        taskPanel.setAttribute('aria-labelledby', task.tabId);
      }
      if (simVideo) {
        simVideo.src = task.sim;
        simVideo.load();
        if (!reduceMotion) {
          simVideo.play().catch(function() {});
        }
      }
      if (realVideo) {
        realVideo.src = task.real;
        realVideo.load();
        if (!reduceMotion) {
          realVideo.play().catch(function() {});
        }
      }
      if (rateReal) rateReal.textContent = task.realRate;
      if (rateSim) rateSim.textContent = task.simRate;
      if (opts.focus) {
        var activeBtn = document.querySelector('.task-option[data-task="' + name + '"]');
        if (activeBtn) activeBtn.focus();
      }
    }

    taskButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        setTask(button.getAttribute('data-task'));
      });
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
        } else {
          return;
        }
        event.preventDefault();
        setTask(taskOrder[next], { focus: true });
      });
    });

    if ('IntersectionObserver' in window) {
      var videoObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          var video = entry.target;
          if (entry.isIntersecting && !reduceMotion) {
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
});
