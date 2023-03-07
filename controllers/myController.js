const MyModel = require('../models/myModel');
const { validationResult } = require('express-validator');

// exports.insertDocument = async (req, res) => {
//   try {
//     const { jsonData } = req.body;
//     console.log("jsonData",jsonData);
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       console.log("error", errors)
//       return res.status(422).json({ success: false, message: errors.array()[0].msg });
//     }
//     await jsonData.forEach(async element => {
//       const nameNumber = Number(element.name.match(/Nippy #(\d+)/)[1]);
//       const newData = {
//         "name": element.name,
//         "description": element.description,
//         "external_url": element.external_url,
//         "image": element.image,
//         "attributes": []
//       };
//       for (let i = 0; i < 15; i++) {
//         console.log("here");
//         newData.attributes.push({
//           "trait_type": element[`attributes/${i}/trait_type`],
//           "value": element[`attributes/${i}/value`]
//         });
//           if (i >= 10) {
//             newData.attributes[i].display_type = "number";
//           }
//       }
//       const myModel = new MyModel({ fileName:nameNumber, jsonData:newData });
//       await myModel.save();
//       });
//     res.status(200).json({ success: true, message: "Successfully added document", data: { } });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server error", error: error.message });
//   }
// };
exports.getDocument = async (req, res) => {
  try {
    const documentName = req.params.fileName;
    const newName = documentName.split('.')[0];
    const document = await MyModel.findOne({fileName:newName});
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
    const documentName = req.params.fileName;
    console.log("documneName",documentName);
    const {jsonData } = req.body;
    console.log("jsonData",jsonData);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, message: errors.array()[0].msg });
    }
    const document = await MyModel.findOne({fileName:documentName});
    if (!document) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }
    console.log("document",document);
    document.jsonData = jsonData;
    const updatedDocument = await document.save();
    console.log("updated",updatedDocument);
    res.status(200).json({ success: true, message: "Successfully updated document", data: updatedDocument });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};