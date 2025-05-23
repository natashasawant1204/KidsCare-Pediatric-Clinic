import { db } from "../js/firebaseConfig.js";
import { doc, getDoc, collection, getDocs, } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
const appointmentsList = document.getElementById("appointmentsList");
const vaccinationsList = document.getElementById("vaccinationsList");
const logout = document.getElementById("logout");
const fetchUserAppointments = async (userId) => {
    try {
        // Reference to the user document
        const userRef = doc(db, "users", userId);  
        const userSnap = await getDoc(userRef);
       
        if (!userSnap.exists()) {
            console.log("User not found!");
            return;
        }

        const userData = userSnap.data();
        const appointmentIds = userData.appointments || []
        console.log("Appointment IDs:", appointmentIds);


        // Fetch all appointments
        const fetchedAppointments = await Promise.all(
            appointmentIds.map(async (aptId) => {
                const aptRef = doc(db, "appointments", aptId);
                const aptSnap = await getDoc(aptRef);

                if (aptSnap.exists()) {
                    const appointmentData = { id: aptId, ...aptSnap.data() };
                     appointmentsList.innerHTML += `
                        <tr>
                            <td>${appointmentData.date}<br>${appointmentData.time}</td>
                            <td>${appointmentData.childName}</td>
                            <td>${appointmentData.doctor}</td>
                            <td>${appointmentData.reason}</td>
                            <td>
                                <span class="badge bg-${getStatusColor(appointmentData.status)}">
                                    ${appointmentData.status}
                                </span>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-danger" onclick="cancelAppointment('${appointmentData.id}')">
                                    <i class="fas fa-times"></i> Cancel
                                </button>
                            </td>
                        </tr>
                    `;
                    console.log("Fetched Appointment:", appointmentData.age);
                    return appointmentData;
                } else {
                    console.warn(`Appointment ID ${aptId} not found.`);
                    return null;
                }
            })
        );

        // Check if there are no appointments
        if (appointmentIds.length === 0) {
            appointmentsList.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">
                        <p class="my-3">No appointments scheduled yet</p>
                        <a href="appointment.html" class="btn btn-primary btn-sm">
                            <i class="fas fa-plus"></i> Book New Appointment
                        </a>
                    </td>
                </tr>
            `;
            return;
        }

      

    } catch (error) {
        console.error("Error fetching appointments:", error);
    }
};

const fetchedVaccinations = async (userId) => {
    try {
        // Reference to the user document
        const userRef = doc(db, "users", userId);  
        const userSnap = await getDoc(userRef);
       
        if (!userSnap.exists()) {
            console.log("User not found!");
            return;
        }

        const userData = userSnap.data();
        const vaccinationIds = userData.vaccination || [];
        console.log("Vaccination IDs:", vaccinationIds);

     

          // Fetch all vaccinations
          const fetchedVaccinations = await Promise.all(
            vaccinationIds.map(async (vacId) => {
                const vacRef = doc(db, "vaccination", vacId);
                const vacSnap = await getDoc(vacRef);

                if (vacSnap.exists()) {
                    const VaccinationsData = { id: vacId, ...vacSnap.data() };
                    vaccinationsList.innerHTML += `
                        <tr>
                            <td>${VaccinationsData.date}<br>${VaccinationsData.time}</td>
                            <td>${VaccinationsData.childName}</td>
                            <td>${VaccinationsData.vaccine}</td>
                            <td>
                                <span class="badge bg-${getStatusColor(VaccinationsData.status)}">
                                    ${VaccinationsData.status}
                                </span>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-danger" onclick="cancelVaccination('${VaccinationsData.id}')">
                                    <i class="fas fa-times"></i> Cancel
                                </button>
                            </td>
                        </tr> 
                   `;
                   console.log("Fetched Vaccinations:", VaccinationsData.name);

                   return VaccinationsData; // Return fetched data for further use if needed
           

                } else {
                    console.warn(`Vaccination ID ${vacId} not found.`);
                    return null;
                }
            })
        );

        // If no vaccinations exist, show message and return early
        if (vaccinationIds.length === 0) {
            vaccinationsList.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">
                        <p class="my-3">No vaccinations scheduled yet</p>
                        <a href="vaccination.html" class="btn btn-primary btn-sm">
                            <i class="fas fa-plus"></i> Book New Vaccination
                        </a>
                    </td>
                </tr>
            `;
            return;
        }
       
    } catch (error) {
        console.error("Error fetching vaccinations:", error);
    }
};




// Check if user is logged in
document.addEventListener('DOMContentLoaded', async function() {
    const loadingOverlay = document.getElementById("loadingOverlay");

    const name = document.getElementById('parentName');
    const user = JSON.parse(localStorage.getItem('user'));

    try {
        // Show the loading screen
        loadingOverlay.style.display = "flex";

        // Simulate fetching user data (Replace with your actual Firestore call)
        const user = JSON.parse(localStorage.getItem("user"));
        
        if (!user) {
            console.error("User not found in localStorage");
            alert("User not logged in!");
            window.location.href = "login.html"; // Redirect to login if no user
            return;
        }
        console.log("User found in localStorage:", user.name);
        name.innerHTML = user.name;

        await Promise.all([
            fetchUserAppointments(user.id),
            fetchedVaccinations(user.id)
        ]);
        console.log("Appointments fetched successfully");

    } catch (error) {
        console.error("Error loading data:", error);
    } finally {
        // Hide the loading screen once everything is ready
        loadingOverlay.style.display = "none";
    }


    

    
});


function getStatusColor(status) {
    switch (status.toLowerCase()) {
        case 'scheduled': return 'primary';
        case 'confirmed': return 'success';
        case 'completed': return 'info';
        case 'cancelled': return 'danger';
        default: return 'secondary';
    }
}

logout.addEventListener('click', function() {
    localStorage.clear('user');
    window.location.href = 'login.html';
}
);

function cancelAppointment(appointmentId) {
    alert(`Cancel appointment with ID ${appointmentId}`);
}




