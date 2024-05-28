const {TicketSchema} = require("../ticket/Ticket.schema")



// Create New Ticket
const insertTicket = (ticketObj) => {
    return new Promise ((resolve, reject)=> {
        try {
           TicketSchema(ticketObj)
           .save()
           .then((data) => resolve(data))
           .catch((error)=> reject(error)) 
        } catch (error) {
            reject(error)
            
        }
    })
}
// Get tickets
const getTickets = (clientId) => {
    return new Promise ((resolve, reject)=> {
        try {
           TicketSchema
           .find({clientId})
           .then((data) => resolve(data))
           .catch((error)=> reject(error)) 
        } catch (error) {
            reject(error)
            
        }
    })
}
// Get Ticket by Id
const getTicketById = (_id, clientId) => {
    return new Promise ((resolve, reject)=> {
        try {
           TicketSchema
           .find({_id, clientId})
           .then((data) => resolve(data))
           .catch((error)=> reject(error)) 
        } catch (error) {
            reject(error)
            
        }
    })
}
// Update Ticket Message
const updateClientReply = ({_id, message, sender }) => {
    return new Promise ((resolve, reject)=> {
        try {
           TicketSchema
           .findOneAndUpdate(
            {_id},
            {
                status:"Pending Operator response",
                $push:{
                    conversations:{message, sender}
                },
            },
            {new: true}
           )
           .then((data) => resolve(data))
           .catch((error)=> reject(error)) 
        } catch (error) {
            reject(error)
            
        }
    })
}
// Update Ticket Status
const updateTicketStatus = ({_id, clientId }) => {
    return new Promise ((resolve, reject)=> {
        try {
           TicketSchema
           .findOneAndUpdate(
            {_id,clientId},
            {
                status:"Closed",
            },
            {new: true}
           )
           .then((data) => resolve(data))
           .catch((error)=> reject(error)) 
        } catch (error) {
            reject(error)
            
        }
    })
}
// Delete ticket 
const deleteTicket = ({ _id, clientId }) => {
    return new Promise((resolve, reject) => {
      try {
        TicketSchema.findOneAndDelete({ _id, clientId })
          .then((data) => resolve(data))
          .catch((error) => reject(error));
      } catch (error) {
        reject(error);
      }
    });
  };
module.exports ={
    insertTicket,
    getTickets,
    getTicketById,
    updateClientReply,
    updateTicketStatus,
    deleteTicket,
}