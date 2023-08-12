

module.exports.index = async function (req, res) { 
  return res.json(200, {
    message: "List of Posts V2",
    posts: [],
  });
};
