export function matchRegistrationsToPayments(tickets, registrations) {
  let pending = [];
  let unpaid = [];
  let unregistered = [];
  let acceptedMissingPayment = [];
  let acceptedPaid = [];
  let deleted = [];

  let unmatchedTickets = [...tickets];
  let unmatchedRegistrations = [...registrations];

  // Match payments to tickets:
  attemptPaymentMatch(unmatchedRegistrations, unmatchedTickets, "wcaid")
  attemptPaymentMatch(unmatchedRegistrations, unmatchedTickets, "email")
  attemptPaymentMatch(unmatchedRegistrations, unmatchedTickets, "name")
  attemptPaymentMatch(unmatchedRegistrations, unmatchedTickets, "email", "order_email")

  // Find accepted and deleted:
  let i = 0;
  while (i < unmatchedRegistrations.length) {
    let reg = unmatchedRegistrations[i];
    switch (reg.status) {
      case "accepted":
        if (reg.paid || reg.organizer || reg.delegate) {
          acceptedPaid.push(reg);
          unmatchedRegistrations.splice(i, 1);
        } else {
          acceptedMissingPayment.push(reg);
          unmatchedRegistrations.splice(i, 1);
        }
        break;
      case "deleted": 
        deleted.push(reg);
        unmatchedRegistrations.splice(i, 1);
        break;
      case "pending":
        if (reg.paid || reg.organizer || reg.delegate) {
          pending.push(reg);
          unmatchedRegistrations.splice(i, 1);
        } else {
          unpaid.push(reg);
          unmatchedRegistrations.splice(i, 1);
        }
        break;
      default:
        i++
        break;      
    }
  }

  // Find not registered
  for (let i in unmatchedTickets) {
    let reg = ticketToReg(unmatchedTickets[i]);
    markPaid(reg, reg);
    unregistered.push(reg);
  }

  
  console.log(unmatchedRegistrations);
  console.log(unmatchedTickets);

  return {
    pending: pending, 
    unregistered: unregistered,
    unpaid: unpaid, 
    acceptedMissingPayment: acceptedMissingPayment,
    acceptedPaid: acceptedPaid, 
    deleted: deleted,
  }
}

function attemptPaymentMatch(registrations, tickets, left_field, right_field) {
  if (!right_field) {
    right_field = left_field;
  }
  for (let i in registrations) {
    let reg = registrations[i];
    matchAndRemovePayment(reg, tickets, left_field, right_field);    
  }
}

function matchAndRemovePayment(reg, tickets, left_field, right_field) {
  reg.paid = reg.paid || false;
  for (let i in tickets) {    
    const ticket = tickets[i];
    if (isMatch(reg[left_field], ticket[right_field])) {
      tickets.splice(i, 1);
      markPaid(reg, ticket);
      return
    }
  }
}

function markPaid(reg, ticket) {
  reg.paid = true;
  reg.ticket_name = ticket.name;
  reg.ticket_email = ticket.email;
  reg.order_email = ticket.order_email;
}

function isMatch(left, right) {
  return left && right && left.length && right.length && left === right;
}

function ticketToReg(ticket) {
  let reg = {...ticket};
  if (reg.email.trim() === "") {
    reg.email = reg.order_email;
  }
  reg.status = "unregistered";
  reg.organizer = false;
  reg.delegate = false;  
  return reg;
}