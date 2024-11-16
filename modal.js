document.getElementById("Aggiungi").onClick=() => {
    createBookingModal();
  }
  
  function createBookingModal() {
    if (!document.getElementById("bookingModal")) {
      const modalHTML = `
        <div class="modal fade" id="bookingModal" tabindex="-1" role="dialog" aria-labelledby="bookingModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="bookingModalLabel">Aggiungi Prenotazione</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <form id="bookingForm">
                  <div class="form-group">
                    <label for="appointmentDate">Data</label>
                    <input type="date" class="form-control" id="appointmentDate" required>
                  </div>
                  <div class="form-group">
                    <label for="appointmentTime">Ora</label>
                    <select class="form-control" id="appointmentTime" required>
                      <option value="">Seleziona un'ora</option>
                      <option value="8">8:00</option>
                      <option value="9">9:00</option>
                      <option value="10">10:00</option>
                      <option value="11">11:00</option>
                      <option value="12">12:00</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="patientName">Nominativo</label>
                    <input type="text" class="form-control" id="patientName" required>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Annulla</button>
                <button type="button" class="btn btn-primary" id="submitBooking">Invia</button>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
  
    $('#bookingModal').modal('show');
  
    document.getElementById("submitBooking").onclick = () => {
      salvaEControllaDati();
    };
  
    document.getElementById("bookingForm").addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        salvaEControllaDati();
      }
    });
  }
  
  function handleBookingSubmit() {
    const date = document.getElementById("appointmentDate").value;
    const time = document.getElementById("appointmentTime").value;
    const patientName = document.getElementById("patientName").value;
  
    if (!date || !time || !patientName) {
      alert("Per favore, compila tutti i campi.");
      return;
    }
  
    const dateKey = formatDate(new Date(date));
    if (!appointmentCache[dateKey]) {
      appointmentCache[dateKey] = {};
    }
    appointmentCache[dateKey][time] = patientName;
  
    console.log("appointmentCache", appointmentCache);
  
    $('#bookingModal').modal('hide');
    document.getElementById("bookingForm").reset();
    renderWeeklySchedule();
  }
  
  function salvaEControllaDati() {
    const date = document.getElementById("appointmentDate").value;
    const time = document.getElementById("appointmentTime").value;
    const patientName = document.getElementById("patientName").value;
  
    if (!date || !time || !patientName) {
      alert("Per favore, compila tutti i campi.");
      return;
    }
  
    let newdatetemp = date.split("-");
    let newdate = `${newdatetemp[2]}/${newdatetemp[1]}/${newdatetemp[0]}`;
    let chiavedaAggiungere = `${newdate}###${time}###${Tipologia}`;
  
    prendiDati(myKey, myToken).then((valcache) => {
      if (valcache[chiavedaAggiungere] != null) {
        alert("il posto non è libero");
        document.getElementById("appointmentDate").value = "";
        document.getElementById("appointmentTime").value = "";
        return;
      } else {
        salvaDati(chiavedaAggiungere, patientName).then(() => {
          alert("Prenotazione aggiunta con successo!");
          $('#bookingModal').modal('hide');
          document.getElementById("bookingForm").reset();
          renderWeeklySchedule();
        }).catch((error) => {
          console.error("Errore durante il salvataggio dei dati:", error);
        });
      }
    }).catch((error) => {
      console.error("Errore durante il recupero dei dati:", error);
    });
  }
  