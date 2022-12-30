exports.handler = async function (event, context) {

  // get the event body
  const request = JSON.parse(event.body);

  // average work times
  const avgUITime = 20;
  const avgCMSTime = 10;
  const avgSEOTime = 25;
  const avgPageTime = 6;
  const hourlyRate = 50;
  const avgContactFormTime = 2;

  // acumulate total hours
  const totalHours = [
    avgCMSTime,
    avgUITime,
    avgContactFormTime,
    avgSEOTime,
    avgPageTime].reduce((acum, value) => acum + value);

  // caculate estimate total
  let totalCost = 0
  totalCost += request.hasCMS ? avgCMSTime * hourlyRate : 0;
  totalCost += request.hasContactForm ? avgContactFormTime * hourlyRate : 0;
  totalCost += request.hasSEO ? avgSEOTime * hourlyRate : 0;
  totalCost += (avgPageTime * request.pageCount) * hourlyRate;

  // acumulate inculde feature names into an array
  let newEstimate = {
    firstName: request.firstName,
    lastName: request.lastName,
    email: request.email,
    pageCount: request.pageCount,
    languages: request.languages,
    hasCMS: request.hasCMS,
    hasSEO: request.hasSEO,
    hasContactForm: request.hasContactForm,
    notes: request.notes,
    totalHours,
    totalCost,
  };

  return {
    statusCode: 200,
    body: JSON.stringify(newEstimate)
  }
}