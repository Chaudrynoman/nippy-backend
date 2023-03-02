const MyModel = require('../models/myModel');
const { validationResult } = require('express-validator');

exports.insertDocument = async (req, res) => {
  try {
    const { jsonData } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("error", errors)
      return res.status(422).json({ success: false, message: errors.array()[0].msg });
    }
    await jsonData.forEach(async element => {
      const nameNumber = Number(element.name.match(/Nippy #(\d+)/)[1]);
      console.log("nameNumber", nameNumber);
      const newData = {
        "name": element.name,
        "description": element.description,
        "external_url": element.external_url,
        "image": element.image,
        "attributes": []
      };
      console.log("newData", newData);
      for (let i = 0; i < 15; i++) {
        newData.attributes.push({
          "trait_type": element[`attributes/${i}/trait_type`],
          "value": element[`attributes/${i}/value`]
        });
          if (i >= 10) {
            newData.attributes[i].display_type = "number";
            console.log("here");
            console.log("newData.attributes[i]",newData.attributes[i]);
          }
      }
      const myModel = new MyModel({ fileName:nameNumber, jsonData:newData });
      console.log("myModel",myModel);
      await myModel.save();
      });
    res.status(200).json({ success: true, message: "Successfully added document", data: { } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
exports.getDocument = async (req, res) => {
  try {
    const documentName = req.query.fileName;
    console.log("dumentName", documentName)
    const document = await MyModel.findOne({fileName:documentName});
    if (!document) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }
    res.status(200).json(document.jsonData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

exports.updateDocument = async (req, res) => {
  try {
    const documentName = req.query.fileName;
    console.log("dumentName", documentName)
    const {jsonData } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, message: errors.array()[0].msg });
    }
    const document = await MyModel.findOne({fileName:documentName});
    if (!document) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }
    document.jsonData = jsonData;
    const updatedDocument = await document.save();
    res.status(200).json({ success: true, message: "Successfully updated document", data: updatedDocument });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};