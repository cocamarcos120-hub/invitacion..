// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const musicToggle = document.getElementById('musicToggle');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const musicStatus = document.getElementById('musicStatus');
    
    const locationBtn = document.getElementById('locationBtn');
    const locationMap = document.getElementById('locationMap');
    const closeMapBtn = document.getElementById('closeMapBtn');
    
    const shareBtn = document.getElementById('shareBtn');
    const notification = document.getElementById('notification');

    // Estado de la música
    let musicPlaying = false;
    let userInteracted = false;

    // Configurar audio
    function setupAudio() {
        // Configurar volumen
        backgroundMusic.volume = 0.4;
        
        // Precargar el audio
        backgroundMusic.load();
        
        // Manejar errores de audio
        backgroundMusic.addEventListener('error', function(e) {
            console.error('Error de audio:', e);
            showNotification('Error al cargar la música. Verifica el archivo de audio.');
            musicToggle.disabled = true;
            musicToggle.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error Audio';
        });
        
        // Permitir reproducción después de interacción del usuario
        document.addEventListener('click', function enableAudio() {
            userInteracted = true;
            showNotification('Audio habilitado. Puedes reproducir la música.');
        }, { once: true });
        
        // Actualizar estado cuando la música termina
        backgroundMusic.addEventListener('ended', function() {
            backgroundMusic.currentTime = 0;
            backgroundMusic.play();
        });
    }

    // Control de música
    musicToggle.addEventListener('click', function() {
        if (!userInteracted) {
            showNotification('Por favor, haz clic primero en cualquier parte de la página');
            return;
        }

        if (musicPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    });

    function playMusic() {
        backgroundMusic.play()
            .then(() => {
                musicPlaying = true;
                musicStatus.textContent = "Música: ON";
                musicToggle.innerHTML = '<i class="fas fa-volume-up"></i> Música: ON';
                showNotification('Música militar activada');
            })
            .catch(error => {
                console.error("Error al reproducir música:", error);
                showNotification('Error al reproducir música. Haz clic en la página primero.');
                musicPlaying = false;
                musicStatus.textContent = "Música: OFF";
            });
    }

    function pauseMusic() {
        backgroundMusic.pause();
        musicPlaying = false;
        musicStatus.textContent = "Música: OFF";
        musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i> Música: OFF';
    }

    // Mostrar/ocultar mapa de ubicación
    locationBtn.addEventListener('click', function() {
        if (locationMap.style.display === 'block') {
            hideMap();
        } else {
            showMap();
        }
    });

    closeMapBtn.addEventListener('click', function() {
        hideMap();
    });

    function showMap() {
        locationMap.style.display = 'block';
        locationBtn.innerHTML = '<i class="fas fa-times"></i> Ocultar Mapa';
        
        // Scroll suave hacia el mapa
        setTimeout(() => {
            locationMap.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center'
            });
        }, 100);
        
        showNotification('Ubicación mostrada. Usa los enlaces para ver en Google Maps');
    }

    function hideMap() {
        locationMap.style.display = 'none';
        locationBtn.innerHTML = '<i class="fas fa-map-marked-alt"></i> Ver Ubicación';
    }

    // Compartir invitación
    shareBtn.addEventListener('click', function() {
        const shareData = {
            title: 'Invitación Licenciamiento - DGTE. David Felipe Quispe',
            text: 'Te invito al licenciamiento de cuartel del DGTE. David Felipe Quispe del Regimiento Germán Busch. Sábado 17 de Enero 2026 a las 18:00 horas. ¡Honor, Deber, Patria!',
            url: window.location.href
        };

        // Usar Web Share API si está disponible
        if (navigator.share) {
            navigator.share(shareData)
                .then(() => {
                    showNotification('Invitación compartida exitosamente');
                })
                .catch(error => {
                    console.log('Error al compartir:', error);
                    copyToClipboard();
                });
        } else {
            copyToClipboard();
        }
    });

    // Copiar al portapapeles
    function copyToClipboard() {
        const shareUrl = window.location.href;
        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                showNotification('Enlace copiado al portapapeles');
            })
            .catch(err => {
                // Fallback para navegadores antiguos
                const textArea = document.createElement('textarea');
                textArea.value = shareUrl;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showNotification('Enlace copiado al portapapeles');
            });
    }

    // Mostrar notificación
    function showNotification(message) {
        notification.textContent = message;
        notification.style.display = 'block';
        notification.style.animation = 'slideInRight 0.3s ease-out';

        // Ocultar después de 4 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 300);
        }, 4000);
    }

    // Efectos visuales
    function addVisualEffects() {
        // Efecto de título con letras individuales
        const title = document.querySelector('.header-title h1');
        if (title) {
            const titleText = title.textContent;
            title.innerHTML = '';
            
            titleText.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.animationDelay = `${index * 0.03}s`;
                span.style.display = 'inline-block';
                span.style.transition = 'all 0.3s';
                title.appendChild(span);
            });
        }

        // Efecto hover en botones
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });

        // Efecto hover en detalles
        const details = document.querySelectorAll('.detail-item');
        details.forEach(detail => {
            detail.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
            });
            
            detail.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });

        // Efecto en emblemas
        const emblems = document.querySelectorAll('.emblem');
        emblems.forEach(emblem => {
            emblem.addEventListener('mouseenter', function() {
                this.style.transform = 'rotate(15deg) scale(1.1)';
                this.style.borderColor = 'var(--military-gold)';
            });
            
            emblem.addEventListener('mouseleave', function() {
                this.style.transform = 'rotate(0) scale(1)';
                this.style.borderColor = 'var(--military-bronze)';
            });
        });

        // Efecto en logos
        const logos = document.querySelectorAll('img[src*="logo"]');
        logos.forEach(logo => {
            logo.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
                this.style.transition = 'transform 0.3s';
            });
            
            logo.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }

    // Contador regresivo
    function startCountdown() {
        const eventDate = new Date('January 17, 2026 18:00:00').getTime();
        
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = eventDate - now;
            
            if (distance > 0) {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                
                console.log(`Faltan ${days} días y ${hours} horas para el evento`);
            } else if (distance <= 0 && distance > -86400000) {
                console.log('¡El evento es hoy!');
            }
        }
        
        // Actualizar cada hora
        setInterval(updateCountdown, 3600000);
        updateCountdown(); // Ejecutar inmediatamente
    }

    // Inicializar todo
    setupAudio();
    addVisualEffects();
    startCountdown();

    // Mostrar mensaje de bienvenida
    setTimeout(() => {
        showNotification('Bienvenido a la invitación oficial del licenciamiento');
    }, 1500);
});