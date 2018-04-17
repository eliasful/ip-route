fetch('http://192.168.90.31:3000/hosts').then(data => {
  return data.json();
}).then(data => {
  joinHtml(data);
});

function joinHtml(data) {
  const list = document.querySelector('.list');
  list.innerHTML = data.map(hostname => {
    return concatHtml(hostname)
  }).join('');
}

function concatHtml(hostname) {
  return `<div class="card">
    <div>${hostname.name}</div>
    <h2>${hostname.ip}</h2>
    <div class="close-btn" title="Remover Registro" onclick="remove('${hostname.name}')">
      X
    </div>
  </div>`;
}

function remove(hostname) {
  if (confirm('Deseja mesmo excluir?')) {
    fetch('http://192.168.90.31:3000/delete', {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({hostname: hostname})
    }).then(data => {
      return data.json();
    }).then(data => {
      joinHtml(data);
    }).catch((err) => {
      alert('Esse hostname não existe!');
    });
  }
}

function add() {
  const hostname = prompt('Por favor, informe o hostname:');
  if (hostname) {
    fetch('http://192.168.90.31:3000/update', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({hostname: hostname})
    }).then(data => {
      return data.json();
    }).then(data => {
      joinHtml(data);
    }).catch(() => {
      alert('Esse hostname já existe!');
    });
  }
}
