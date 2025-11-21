function Api_Response(data = {}, { success = true, message = null } = {}) {
  return {
    success,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}

function Api_Erorr_Response({
  data = null,
  success = false,
  message = "",
} = {}) {
  return {
    success,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}

module.exports = { Api_Response, Api_Erorr_Response };
