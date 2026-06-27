/*
  menu.js
  --------
  Controla la interacción del menú de contactos:
  - Mostrar datos del contacto seleccionado
  - Activar modo eliminación
  - Ordenar contactos
  - Buscar y filtrar por categoría/favorito
  - Redirigir a reporte y actualización
*/

let deleteMode = false;

document.addEventListener('DOMContentLoaded', () => {

  const contactDetail = document.getElementById('contact-detail');
  const deleteBtn = document.querySelector('.btn-action.delete');
  const sortBtn = document.querySelector('.btn-action.sort');
  const contactList = document.getElementById('contact-list');
  const searchInput = document.getElementById('search-input');

  const updateBtn = document.getElementById('update-btn');
  const updateForm = document.getElementById('update-form');  

  // ---------------- MOSTRAR DETALLE ----------------
  document.querySelectorAll('.contact-item').forEach(contact => {

    contact.addEventListener('click', () => {

      if (deleteMode) return;

      const nombre = contact.dataset.nombre;
      const telefono = contact.dataset.telefono;
      const correo = contact.dataset.correo;
      const direccion = contact.dataset.direccion;
      const nota = contact.dataset.nota;
      const favorito = contact.dataset.favorito;
      const categoria = contact.dataset.categoria;

      contactDetail.innerHTML = `
        <h3>
          ${nombre}
          ${favorito === "Sí" ? "⭐" : ""}
        </h3>

        <p><strong>Teléfono:</strong> ${telefono}</p>
        <p><strong>Correo:</strong> ${correo}</p>
        <p><strong>Dirección:</strong> ${direccion}</p>
        <p><strong>Nota:</strong> ${nota}</p> 
        <p><strong>Categoría:</strong> ${categoria}</p>
        <p><strong>Estado:</strong> ✅ Conectado</p>
      `;

      if (updateBtn) {
        updateBtn.style.display = "block";

        updateBtn.onclick = () => {
          window.location.href = `/update_contact_form?old_nombre=${encodeURIComponent(nombre)}`;
        };
      }

    });

  });

  // ---------------- ELIMINAR ----------------
  if (deleteBtn) {

    deleteBtn.addEventListener('click', () => {

      const checkboxes =
        document.querySelectorAll('.delete-checkbox');

      if (!deleteMode) {

        deleteMode = true;

        deleteBtn.textContent =
          "Confirmar eliminación";

        checkboxes.forEach(cb => {
          cb.style.display = "block";
        });

      } else {

        const selected =
          document.querySelectorAll(
            '.delete-checkbox:checked'
          );

        if (selected.length === 0) {
          alert('Selecciona al menos un contacto');
          return;
        }

        const confirmar = confirm(
    '¿Está seguro/a que desea eliminar al contacto? Esta acción no puede ser revertida'
        );

      if (!confirmar) {
        return;
      }

      const rowsToDelete = Array.from(selected)
        .map(cb => cb.closest('.contact-item')?.dataset.row)
        .filter(Boolean);

      if (rowsToDelete.length === 0) {
        alert('No se encontraron contactos válidos para eliminar.');
        return;
      }

      fetch('/delete_contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rows: rowsToDelete })
      })
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            window.location.reload();
          } else {
            alert(result.error || 'No se pudo eliminar el contacto');
          }
        })
        .catch(() => {
          alert('Error de red al intentar eliminar contactos.');
        });
      }
    });
  }

  // ---------------- ORDENAR ----------------
  if (sortBtn && contactList) {

    sortBtn.addEventListener('click', () => {

      const items =
        Array.from(
          contactList.querySelectorAll('.contact-item')
        );

      items.sort((a, b) => {

        const nameA =
          a.dataset.nombre.toLowerCase();

        const nameB =
          b.dataset.nombre.toLowerCase();

        return nameA.localeCompare(nameB);

      });

      contactList.innerHTML = '';

      items.forEach(item => {
        contactList.appendChild(item);
      });

    });

  }
  
    // ---------------- BUSCADOR Y FILTROS ----------------
  const filterButtons = document.querySelectorAll('.filter-btn[data-filter-category]');
  const favoriteFilter = document.getElementById('favorite-filter');
  let activeCategory = 'Todos';
  let favoriteOnly = false;

  const filterContacts = () => {
    const query = searchInput.value.toLowerCase();
    const items = contactList.querySelectorAll('.contact-item');

    items.forEach(item => {
      const name = item.dataset.nombre.toLowerCase();
      const category = item.dataset.categoria.toLowerCase();
      const favorito = item.dataset.favorito;

      const matchesSearch = name.includes(query);
      const matchesCategory = activeCategory === 'Todos' || category === activeCategory.toLowerCase();
      const matchesFavorite = !favoriteOnly || favorito === 'Sí';

      item.style.display = matchesSearch && matchesCategory && matchesFavorite ? 'flex' : 'none';
    });
  };

  // ---------------- BUSCADOR ----------------
  if (searchInput && contactList) {

    searchInput.addEventListener('input', filterContacts);

  }

  if (filterButtons.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(button => button.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.dataset.filterCategory;
        if (favoriteFilter) favoriteFilter.classList.toggle('active', false);
        favoriteOnly = false;
        filterContacts();
      });
    });
  }
  
    // ---------------- FILTRAR FAVORITOS ----------------
  if (favoriteFilter) {
    favoriteFilter.addEventListener('click', () => {
      favoriteOnly = !favoriteOnly;
      favoriteFilter.classList.toggle('active', favoriteOnly);
      if (favoriteOnly) {
        filterButtons.forEach(button => button.classList.remove('active'));
        activeCategory = 'Todos';
      }
      filterContacts();
    });
  }

  // ---------------- VALIDAR TELÉFONO ----------------
  const telefonoInput =
    document.getElementById('telefono');

  const form =
    document.getElementById('contact-form');

  if (telefonoInput) {

    telefonoInput.addEventListener(
      'input',
      function () {

        this.value =
          this.value.replace(/\D/g, '');

        if (this.value.length > 8) {

          this.value =
            this.value.slice(0, 8);

        }

      }
    );

  }
  
    // CONFIRMAR ACTUALIZACIÓN DE CONTACTO
  if (form && telefonoInput) {

    form.addEventListener(
      'submit',
      function (e) {

        if (
          telefonoInput.value.length !== 8
        ) {

          e.preventDefault();

          alert(
         'El número debe tener exactamente 8 dígitos' ); }});}

  // ---------------- REPORTE ----------------
  const reportBtn = document.getElementById('report-btn');

  if (reportBtn) {
    reportBtn.addEventListener('click', () => {
      window.location.href = '/reporte';
    });
  }
});



  

// CONFIRMAR ACTUALIZACIÓN DE CONTACTO
const updateForm = document.getElementById('update-form');

if (updateForm) {

    updateForm.addEventListener('submit', function (e) {

        const confirmar = confirm(
            "¿Está seguro/a que desea actualizar la información del contacto? Esta acción no puede ser revertida."
        );

        if (!confirmar) {
            e.preventDefault();
        }

    });

}