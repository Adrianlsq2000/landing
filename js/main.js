const databaseURL = 'https://landing-122b5-default-rtdb.firebaseio.com/respuestas.json';

// Función para enviar los datos del formulario
let sendData = () => {  
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data['saved'] = new Date().toLocaleString('es-CO', { timeZone: 'America/Guayaquil' });

    fetch(databaseURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }
            return response.json();
        })
        .then(() => {
            alert('Gracias por suscribirte, nos pondremos en contacto contigo pronto.');
            form.reset();
            getData(); // Actualizar suscripciones
            updateVotes(); // Actualizar votaciones
        })
        .catch(error => {
            alert('Hemos experimentado un error. ¡Vuelve pronto!');
            console.error(error);
        });
};

// Función para obtener datos de suscripciones
let getData = async () => {
    try {
        const response = await fetch(databaseURL);
        if (!response.ok) {
            alert("Hemos experimentado un error. ¡Vuelve pronto!");
        }
        const data = await response.json();
        if (data) {
            let countSubs = new Map();
            if (Object.keys(data).length > 0) {
                for (let key in data) {
                    let { saved } = data[key];
                    let date = saved.split(",")[0];
                    let count = countSubs.get(date) || 0;
                    countSubs.set(date, count + 1);
                }
            }
            if (countSubs.size > 0) {
                subscribers.innerHTML = '';
                let i = 0;
                for (let [date, count] of countSubs) {
                    let rowTemplate = `
                        <tr>
                            <th scope="row">${++i}</th>
                            <td>${date}</td>
                            <td>${count}</td>
                        </tr>`;
                    subscribers.innerHTML += rowTemplate;
                }
            }
        }
    } catch (error) {
        alert("Hemos experimentado un error. ¡Vuelve pronto!");
        console.error(error);
    }
};

//Actualizar votos de la tabla de votaciones
let updateVotes = async () => {
    try {
        const response = await fetch(databaseURL);
        if (!response.ok) {
            throw new Error("Error al obtener los datos de votaciones.");
        }

        const data = await response.json();
        if (data) {
            let voteCounts = {
                "Amigurumi de Arcane": 0,
                "Llaveros de navidad": 0,
                "Flores con adornos navideños": 0
            };

            // Contar votos por producto
            for (let key in data) {
                const { product } = data[key];
                if (product && voteCounts.hasOwnProperty(product)) {
                    voteCounts[product]++;
                }
            }

            // Actualizacion de la tabla con los votos
            const votacionTable = document.getElementById('votacion-table');
            if (votacionTable) {
                votacionTable.innerHTML = `
                    <tr>
                        <td>Amigurumi de Arcane</td>
                        <td>${voteCounts["Amigurumi de Arcane"]}</td>
                    </tr>
                    <tr>
                        <td>Llaveros de navidad</td>
                        <td>${voteCounts["Llaveros de navidad"]}</td>
                    </tr>
                    <tr>
                        <td>Flores con adornos navideños</td>
                        <td>${voteCounts["Flores con adornos navideños"]}</td>
                    </tr>
                `;
            }
        }
    } catch (error) {
        console.error("Error al actualizar la tabla de votaciones:", error);
    }
};

let ready = () => {
    console.log('DOM está listo');
    getData();
    updateVotes(); // Actualizar la tabla al cargar la pagina
};

let loaded = () => {
    console.log('Iframes e Images cargadas');
    let myform = document.getElementById('form');
      
    myform.addEventListener('submit', (eventSubmit) => {
        eventSubmit.preventDefault();

        const nameElement = document.querySelector('#form-name');
        const nameText = nameElement.value.trim();
        const emailElement = document.querySelector('#form-email');
        const emailText = emailElement.value.trim();
        const productElement = document.querySelector('#form-product');
        const productValue = productElement.value;

        // Validar nombre
        if (nameText.length === 0) {
            nameElement.focus();
            nameElement.animate(
                [
                    { transform: "translateX(0)" },
                    { transform: "translateX(50px)" },
                    { transform: "translateX(-50px)" },
                    { transform: "translateX(0)" }
                ],
                {
                    duration: 400,
                    easing: "linear",
                }
            );
            return;
        }

        // Validar email
        if (emailText.length === 0) {
            emailElement.focus();
            emailElement.animate(
                [
                    { transform: "translateX(0)" },
                    { transform: "translateX(50px)" },
                    { transform: "translateX(-50px)" },
                    { transform: "translateX(0)" }
                ],
                {
                    duration: 400,
                    easing: "linear",
                }
            );
            return;
        }

        // Validar selección de producto
        if (!productValue) {
            productElement.focus();
            productElement.animate(
                [
                    { transform: "translateX(0)" },
                    { transform: "translateX(50px)" },
                    { transform: "translateX(-50px)" },
                    { transform: "translateX(0)" }
                ],
                {
                    duration: 400,
                    easing: "linear",
                }
            );
            return;
        }

        sendData();
    });
};

document.querySelectorAll('.offcanvas-body .nav-link').forEach(link => {
    link.addEventListener('click', event => {
        const href = link.getAttribute('href');
        // Evita el comportamiento predeterminado en enlaces con submenús
        if (link.classList.contains('dropdown-toggle')) {
            return;
        }

        // Solo actuar si es un enlace interno (que empieza con #)
        if (href && href.startsWith('#')) {
            event.preventDefault(); // Previene el salto inmediato
            const offcanvas = document.querySelector('#offcanvasNavbar');
            const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvas);
            if (offcanvasInstance) {
                offcanvasInstance.hide(); // Cierra el menú
            }
            // Navega después de un breve retraso
            setTimeout(() => {
                window.location.hash = href; // Realiza la navegación
            }, 300); // Ajusta el tiempo si es necesario
        }
    });
});
document.querySelectorAll('.dropdown-menu .dropdown-item').forEach(item => {
    item.addEventListener('click', event => {
        const href = item.getAttribute('href');
        // Asegura que sea un enlace interno
        if (href && href.startsWith('#')) {
            event.preventDefault(); // Previene el salto inmediato
            const offcanvas = document.querySelector('#offcanvasNavbar');
            const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvas);
            if (offcanvasInstance) {
                offcanvasInstance.hide(); // Cierra el menú principal
            }
            // Navega después de cerrar el menú
            setTimeout(() => {
                window.location.hash = href;
            }, 300); // Ajusta el tiempo si es necesario
        }
    });
});





window.addEventListener("DOMContentLoaded", ready);
window.addEventListener("load", loaded);







