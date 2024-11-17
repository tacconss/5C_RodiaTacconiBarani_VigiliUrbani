// Funzione per creare il modal
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
                  <div id="incidentPlates">
                  <input type="text" class="form-control" id="targa1" required>
                  <input type="text" class="form-control" id="targa2" required>
                  <input type="text" class="form-control" id="targa3" required>
                  </div>
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


window.onload = function() {
  const aggiungiButton = document.getElementById("Aggiungi");
  if (aggiungiButton) {
    aggiungiButton.onclick = function() {
      createIncidentModal();
      $("#incidentModal").modal("show");

      
      const submitButton = document.getElementById("submitIncident");
      if (submitButton) {
        submitButton.onclick = function() {
          /*
          const incident = {
            //Qua caricati i dati
            address: document.getElementById("incidentAddress").value,
            plates: document.getElementById("incidentPlates").value.split(',').map(plate => plate.trim()).slice(0, 3),
            dateTime: document.getElementById("incidentDateTime").value,
            injuries: parseInt(document.getElementById("incidentInjuries").value, 10) || 0,
            deaths: parseInt(document.getElementById("incidentDeaths").value, 10) || 0,
          };
*/
let targa_1=document.getElementById("targa1");
let targa_2=document.getElementById("targa2");
let targa_3=document.getElementById("targa3");
let indirizzo=document.getElementById("incidentAddress");
let data =document.getElementById("incidentDateTime");
let feriti=document.getElementById("incidentInjuries");
let morti=document.getElementById("incidentDeaths");

if(
   (targa_1.value!=null||targa_1.value!=undefined||targa_1.value!="")
    &&
   (targa_2.value!=null||targa_2.value!=undefined||targa_2.value!="")
   &&
   (indirizzo.value!=null||indirizzo.value!=undefined||indirizzo.value!="")
   &&
   (data.value!=null||data.value!=undefined||data.value!="")
   &&
   (feriti.value!=null||feriti.value!=undefined||feriti.value!="")
   &&
   (morti.value!=null||morti.value!=undefined||morti.value!="")
   
   ){
let targa_1T=targa_1.value;
let targa_2T=targa_2.value;
let targa_3T=targa_3.value;
let indirizzoT=indirizzo.value;
let dataT =data.value;
let feritiT=feriti.value;
let mortiT=morti.value;
prendiDati("via fiume 73,Vimodrone").then((responce)=>{
  let dim=responce.length;
  let valToUse=null;
  valToUse=responce[0];
  let long=valToUse["lon"];
  let lat=valToUse["lat"];
  
  salvaDati(mortiT,feritiT,dataT,indirizzoT,long, lat,targa_1T,targa_2T,targa_3T,).then(render);
});
}
          console.log("Dati dell'incidente:", incident);
          
          
          $("#incidentModal").modal("hide");
        };
      }
    };
  }
};
