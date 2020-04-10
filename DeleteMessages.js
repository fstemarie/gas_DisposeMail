function getMessagesToDelete(lblFreqs = null) {
  let threads, beforeDate;
  let messages = [];

  for (let lf in lblFreqs) {
    switch(lblFreqs[lf]) {
      case "day": beforeDate = moment().subtract(1, 'days');
        break;
      case "week": beforeDate = moment().subtract(1, 'week');
        break;
      case "2weeks": beforeDate = moment().subtract(2, 'week');
        break;
      case "month": beforeDate = moment().subtract(1, 'month');
        break;
      case "3months": beforeDate = moment().subtract(3, 'month');
        break;
      case "6months": beforeDate = moment().subtract(6, 'month');
        break;
      case "year": beforeDate = moment().subtract(1, 'year');
        break;
      case "never": beforeDate = null
      default:
    }

    let threads = GmailApp.getUserLabelByName(lf).getThreads();
    threads.forEach((thread) => {
      let msgs = thread.getMessages()
      msgs.filter((msg) => {
        return !moment(msg.getDate()).isBefore(beforeDate)
      });
      messages = messages.concat(msgs);
    });
  }
  return messages;
}

function deleteMessages(messages) {
  for (let message of messages) {
    if (moment(message.getDate()).isBefore(beforeDate)) {
      try {
        message.moteToTrash();
        Utilities.sleep(300);
      }
      catch {
      }
    }
  }
}
