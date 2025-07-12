document.addEventListener("DOMContentLoaded", async () => {
  const community = localStorage.getItem("community");
  const houseNumber = localStorage.getItem("houseNumber");

  const eventsContainer = document.getElementById("eventsContainer");

  try {
    const res = await fetch(`/api/events/${community}`);
    const data = await res.json();

    if (data.success) {
      data.data.forEach(event => {
        const div = document.createElement("div");
        div.className = "event-card";
        div.innerHTML = `
          <img src="${event.image}" alt="event" />
          <div class="event-details">
            <h3>${event.name}</h3>
            <p>${event.description}</p>
            <p>🎟️ Tickets Left: ${event.ticketLimit === 0 ? 'Unlimited' : event.ticketLeft}</p>
            <label>No. of Tickets:</label>
            <input type="number" id="count_${event._id}" min="1" max="${event.maxPerUser}" value="1">
            <br>
            <button onclick="registerEvent('${event._id}', ${event.ticketLimit}, ${event.ticketLeft}, ${event.maxPerUser})">Book Now</button>
            <p id="msg_${event._id}" style="color: green;"></p>
          </div>
        `;
        eventsContainer.appendChild(div);
      });
    }
  } catch (err) {
    console.error("❌ Failed to load events", err);
  }

  window.registerEvent = async (eventId, ticketLimit, ticketLeft, maxPerUser) => {
    const tickets = parseInt(document.getElementById(`count_${eventId}`).value);
    const msg = document.getElementById(`msg_${eventId}`);

    if (tickets < 1 || tickets > maxPerUser) {
      msg.textContent = `❗ Max ${maxPerUser} tickets allowed per person`;
      msg.style.color = 'red';
      return;
    }

    if (ticketLimit !== 0 && tickets > ticketLeft) {
      msg.textContent = `❗ Only ${ticketLeft} tickets left`;
      msg.style.color = 'red';
      return;
    }

    try {
      const res = await fetch('/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, tickets, houseNumber, community })
      });

      const result = await res.json();
      msg.style.color = result.success ? 'green' : 'red';
      msg.textContent = result.message;

      if (result.success) setTimeout(() => location.reload(), 1000);
    } catch (err) {
      console.error("❌ Error booking event", err);
      msg.textContent = "❌ Server error";
      msg.style.color = 'red';
    }
  };
});
