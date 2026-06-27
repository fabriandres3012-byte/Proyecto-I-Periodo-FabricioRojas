 
    // JavaScript para validar el campo de teléfono en el formulario de agregar contacto
 const telefonoInput =
      document.getElementById('telefono');

    const form =
      document.getElementById('contact-form');

    const telefonoError =
      document.getElementById('telefono-error');


    // Validar mientras se escribe
    telefonoInput.addEventListener(
      'input',
      function () {

        this.value =
          this.value.replace(/\D/g, '');

        // máximo 8
        if (this.value.length > 8) {
          this.value =
            this.value.slice(0, 8);
        }

        // ocultar error mientras escribe
        telefonoError.style.display =
          "none";
      }
    );


    // Validar al enviar
    form.addEventListener(
      'submit',
      function (e) {

        if (
          telefonoInput.value.length !== 8
        ) {

          e.preventDefault();

          telefonoError.style.display =
            "block";

          telefonoInput.focus();
        }
      }
    );