const databaseURL = 'https://landing-122b5-default-rtdb.firebaseio.com/respuestas.json';

let sendData = () => {  
    // Obtén los datos del formulario
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries()); // Convierte FormData a objeto
    data['saved'] = new Date().toLocaleString('es-CO', { timeZone: 'America/Guayaquil' });
    fetch(databaseURL, {
        method: 'POST', // Método de la solicitud
        headers: {
            'Content-Type': 'application/json' // Especifica que los datos están en formato JSON
        },
        body: JSON.stringify(data) // Convierte los datos a JSON
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }
            return response.json(); // Procesa la respuesta como JSON
        })
        .then(result => {
            alert('Gracias por suscribirte, nos pondremos en contacto contigo pronto.'); // Maneja la respuesta con un mensaje
            form.reset();
            getData();
        })
        .catch(error => {
            alert('Hemos experimentado un error. ¡Vuelve pronto!'); // Maneja el error con un mensaje
        });
};

let getData = async () => {
    try {
        const response = await fetch(databaseURL);
        if (!response.ok) {
            alert("Hemos experimentado un error. ¡Vuelve pronto!");
        }
        const data = await response.json();
        if (data != null) {
            let countSubs = new Map();
            if (Object.keys(data).length > 0) {
                for (let key in data) {
                    let { email, saved } = data[key];
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
    }
    catch (error) {
        alert("Hemos experimentado un error. ¡Vuelve pronto!");
    }
};

let ready = () => {
    console.log('DOM está listo');
    getData();
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

window.addEventListener("DOMContentLoaded", ready);
window.addEventListener("load", loaded);

