function createIncidentModal() {
  if (!document.getElementById("incidentModal")) {
    const modalHTML = `
      <div class="modal fade" id="incidentModal" tabindex="-1" role="dialog" aria-labelledby="incidentModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="incidentModalLabel">Aggiungi Incidente</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form id="incidentForm">
                <div class="form-group">
                  <label for="incidentAddress">Indirizzo (compreso di civico)</label>
                  <input type="text" class="form-control" id="incidentAddress" required>
                </div>
                <div class="form-group">
                  <label for="incidentPlates">Targhe Coinvolte (fino a 3)</label>
                  <input type="text" class="form-control" id="incidentPlates" required>
                </div>
                <div class="form-group">
                  <label for="incidentDateTime">Data e Ora</label>
                  <input type="datetime-local" class="form-control" id="incidentDateTime" required>
                </div>
                <div class="form-group">
                  <label for="incidentInjuries">Numero Feriti</label>
                  <input type="number" class="form-control" id="incidentInjuries" min="0" required>
                </div>
                <div class="form-group">
                  <label for="incidentDeaths">Numero Morti</label>
                  <input type="number" class="form-control" id="incidentDeaths" min="0" required>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Annulla</button>
              <button type="button" class="btn btn-primary" id="submitIncident">Salva</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }
}

// Aggiungere evento al pulsante
document.getElementById("Aggiungi").addEventListener("click", () => {
  createIncidentModal();
  $("#incidentModal").modal("show"); 

  document.getElementById("submitIncident").addEventListener("click", async () => {
    const incident = {
      address: document.getElementById("incidentAddress").value,
      plates: document.getElementById("incidentPlates").value.split(',').map(plate => plate.trim()).slice(0, 3),
      dateTime: document.getElementById("incidentDateTime").value,
      injuries: parseInt(document.getElementById("incidentInjuries").value, 10) || 0,
      deaths: parseInt(document.getElementById("incidentDeaths").value, 10) || 0,
    };

    console.log("Dati dell'incidente:", incident);

    
    $("#incidentModal").modal("hide");
  });
});
