import { connectDB } from "../config/db.js";
import { ObjectId } from 'mongodb';

const db = await connectDB(); // Ensure connectDB returns the database instance
const PostDetailsModel =  db.collection("postdetails");
const CSVDataModel =  db.collection("csvusers");
const CSVCoupleModel =  db.collection("csvcoupleusers");

const getBirthDayData = async (birthDayId, targetDate = null) => {
  try {
    const BirthDayModel = db.collection("birthdaysgreetings");

    // Find the birthDayData document by ID
    let birthDayData = await BirthDayModel.findOne({ _id: new ObjectId(birthDayId) });

    if (!birthDayData) {
      console.log("No BirthDay found with the given ID:", birthDayId);
      return null;
    }

    // Resolve the postDetails reference
    const postDetails = await PostDetailsModel.findOne({ _id: new ObjectId(birthDayData.postDetails) });

    // console.log(birthDayData);
    if (!postDetails) {
      console.log("No PostDetails found for the given postDetails ID:", birthDayData.postDetails);
      return null;
    }

    let csvData = [];
    // Fetch the referenced csvData based on the targetDate (if provided)
    if (targetDate) {
      // Filter by date_month if targetDate is provided
      csvData = Array.isArray(birthDayData.csvData)
        ? await CSVDataModel.find({
            _id: { $in: birthDayData.csvData.map(id => new ObjectId(id)) },
            date_month: targetDate,
          }).toArray()
        : [];
    } else {
      // No targetDate provided, fetch all csvData references
      csvData = Array.isArray(birthDayData.csvData)
        ? await CSVDataModel.find({ _id: { $in: birthDayData.csvData.map(id => new ObjectId(id)) } }).toArray()
        : [];
    }

    // Update birthDayData with resolved references
    birthDayData.postDetails = postDetails;
    birthDayData.csvData = csvData;

    // Debug log the final result
    // console.log("Resolved BirthDay data with postDetails and csvData:", birthDayData);

    return birthDayData;
  } catch (error) {
    console.error("Error in getBirthDayData:", error);
    return null;
  }
};


const getEventData = async (eventId, targetDate = null) => {
  try {
    const EventSchema = db.collection("eventsgreetings");

    // Find the birthDayData document by ID
    let eventData = await EventSchema.findOne({ _id: new ObjectId(eventId) });

    if (!eventData) {
      console.log("No eventData found with the given ID:", eventId);
      return null;
    }

    // Resolve the postDetails reference
    const postDetails = await PostDetailsModel.findOne({ _id: new ObjectId(eventData.postDetails) });

    if (!postDetails) {
      console.log("No PostDetails found for the given postDetails ID:", eventData.postDetails);
      return null;
    }

    let csvData = [];
    // Fetch the referenced csvData based on the targetDate (if provided)
    if (targetDate) {
      // Filter by date_month if targetDate is provided
      csvData = Array.isArray(eventData.csvData)
        ? await CSVDataModel.find({
            _id: { $in: eventData.csvData.map(id => new ObjectId(id)) },
            date_month: targetDate,
          }).toArray()
        : [];
    } else {
      // No targetDate provided, fetch all csvData references
      csvData = Array.isArray(eventData.csvData)
        ? await CSVDataModel.find({ _id: { $in: eventData.csvData.map(id => new ObjectId(id)) } }).toArray()
        : [];
    }

    // Update birthDayData with resolved references
    eventData.postDetails = postDetails;
    eventData.csvData = csvData;

    // Debug log the final result
    // console.log("Resolved eventData data with postDetails and csvData:", eventData);

    return eventData;

  } catch (error) {
    console.error("Error in the getEventData:", error);
    return null;
  }
};


const getFestivalData = async (festivalId, targetDate = null) => {
  try {
    const FestivalSchema = db.collection("festivalsgreetings");

    // Find the birthDayData document by ID
    let festivalData = await FestivalSchema.findOne({ _id: new ObjectId(festivalId) });

    if (!festivalData) {
      console.log("No festivalData found with the given ID:", festivalId);
      return null;
    }

    // Resolve the postDetails reference
    const postDetails = await PostDetailsModel.findOne({ _id: new ObjectId(festivalData.postDetails) });

    if (!postDetails) {
      console.log("No PostDetails found for the given postDetails ID:", festivalData.postDetails);
      return null;
    }

    let csvData = [];
    // Fetch the referenced csvData based on the targetDate (if provided)
    if (targetDate) {
      // Filter by date_month if targetDate is provided
      csvData = Array.isArray(festivalData.csvData)
        ? await CSVDataModel.find({
            _id: { $in: festivalData.csvData.map(id => new ObjectId(id)) },
            date_month: targetDate,
          }).toArray()
        : [];
    } else {
      // No targetDate provided, fetch all csvData references
      csvData = Array.isArray(festivalData.csvData)
        ? await CSVDataModel.find({ _id: { $in: festivalData.csvData.map(id => new ObjectId(id)) } }).toArray()
        : [];
    }

    // Update birthDayData with resolved references
    festivalData.postDetails = postDetails;
    festivalData.csvData = csvData;

    // Debug log the final result
    // console.log("Resolved festivalData data with postDetails and csvData:", festivalData);

    return festivalData;
  } catch (error) {
    console.error("Error in the getFestivalData:", error);
    return null;
  }
};


const getMarriageData = async (marriageId, targetDate = null) => {
  try {
    const MarriageSchema = db.collection("marriagesgreetings");

    // Find the birthDayData document by ID
    let marriageData = await MarriageSchema.findOne({ _id: new ObjectId(marriageId) });

    if (!marriageData) {
      console.log("No marriageData found with the given ID:", marriageId);
      return null;
    }

    // Resolve the postDetails reference
    const postDetails = await PostDetailsModel.findOne({ _id: new ObjectId(marriageData.postDetails) });

    if (!postDetails) {
      console.log("No PostDetails found for the given postDetails ID:", marriageData.postDetails);
      return null;
    }

    let csvData = [];
    // Fetch the referenced csvData based on the targetDate (if provided)
    if (targetDate) {
      // Filter by date_month if targetDate is provided
      csvData = Array.isArray(marriageData.csvData)
        ? await CSVDataModel.find({
            _id: { $in: marriageData.csvData.map(id => new ObjectId(id)) },
            date_month: targetDate,
          }).toArray()
        : [];
    } else {
      // No targetDate provided, fetch all csvData references
      csvData = Array.isArray(marriageData.csvData)
        ? await CSVCoupleModel.find({ _id: { $in: marriageData.csvData.map(id => new ObjectId(id)) } }).toArray()
        : [];
    }

    // Update birthDayData with resolved references
    marriageData.postDetails = postDetails;
    marriageData.csvData = csvData;

    // Debug log the final result
    // console.log("Resolved marriageData data with postDetails and csvData:", marriageData);


    return marriageData;
  } catch (error) {
    console.error("Error in getMarriageData:", error);
    return null;
  }
};


const getTempleData = async (templeId, targetDate = null) => {
  try {
    const TempleSchema = db.collection("templedetailsgreetings");

    let templeData = await TempleSchema.findOne({ _id: new ObjectId(templeId) });

    if (!templeData) {
      console.log("No templeData found with the given ID:", templeId);
      return null;
    }

    // Resolve the postDetails reference
    const postDetails = await PostDetailsModel.findOne({ _id: new ObjectId(templeData.postDetails) });

    if (!postDetails) {
      console.log("No PostDetails found for the given postDetails ID:", templeData.postDetails);
      return null;
    }
  

    let csvData = [];
    // Fetch the referenced csvData based on the targetDate (if provided)
    if (targetDate) {
      // Filter by date_month if targetDate is provided
      csvData = Array.isArray(templeData.csvData)
        ? await CSVDataModel.find({
            _id: { $in: templeData.csvData.map(id => new ObjectId(id)) },
            date_month: targetDate,
          }).toArray()
        : [];
    } else {
      // No targetDate provided, fetch all csvData references
      csvData = Array.isArray(templeData.csvData)
        ? await CSVDataModel.find({ _id: { $in: templeData.csvData.map(id => new ObjectId(id)) } }).toArray()
        : [];
    }

    // Update birthDayData with resolved references
    templeData.postDetails = postDetails;
    templeData.csvData = csvData;

    // Debug log the final result
    // console.log("Resolved BirthDay data with postDetails and csvData:", templeData);

    return templeData;
  } catch (error) {
    console.error("Error in getTempleData:", error);
    return null;
  }
};


const updateBirthDayResponse = async (id, data) => {
  try {
    const BirthDayModel = db.collection("birthdaysgreetings");

    // Find the document by ID
    const updateResponse = await BirthDayModel.findOne({ _id: new ObjectId(id) });

    if (!updateResponse) {
      throw new Error(`Birthday details not found with id: ${id}`);
    }

    // Push new response data into the array
    updateResponse.response.push(...data);

    // Update the document in the collection
    await BirthDayModel.updateOne(
      { _id: new ObjectId(id) },
      { $set: { response: updateResponse.response } }
    );

    console.log("Updated Response:", updateResponse);
  } catch (error) {
    console.log("Error in updateResponse:", error);
  }
};



const updateEventResponse = async (id, data) => {
  try {

    const EventSchema = db.collection("eventsgreetings");

    // Find the document by ID
    const updateResponse = await EventSchema.findOne({ _id: new ObjectId(id) });

    if (!updateResponse) {
      throw new Error(`Event details not found with id: ${id}`);
    }

    // Push new response data into the response array
    updateResponse.response.push(...data);

    // Update the document in the collection
    await EventSchema.updateOne(
      { _id: new ObjectId(id) },
      { $set: { response: updateResponse.response } }
    );

    // console.log("Updated Event Response:", updateResponse);
  } catch (error) {
    console.error("Error in updateEventResponse:", error);
  }
};


const updateFestivalResponse = async (id, data) => {
  try {
    const FestivalSchema = db.collection("festivalsgreetings"); // Correct collection name

    // Find the document by ID
    const updateResponse = await FestivalSchema.findOne({ _id: new ObjectId(id) });

    if (!updateResponse) {
      throw new Error(`Festival details not found with id: ${id}`);
    }

    // Push new response data into the array
    updateResponse.response.push(...data);

    // Update the document in the collection
    await FestivalSchema.updateOne(
      { _id: new ObjectId(id) },
      { $set: { response: updateResponse.response } }
    );

    // console.log("Updated Festival Response:", updateResponse);
  } catch (error) {
    console.error("Error in updateFestivalResponse:", error);
  }
};



const updateMarriageResponse = async (id, data) => {
  try {
    const MarriageSchema = db.collection("marriagesgreetings"); // Correct collection name

    // Find the document by ID
    const updateResponse = await MarriageSchema.findOne({ _id: new ObjectId(id) });

    if (!updateResponse) {
      throw new Error(`Marriage details not found with id: ${id}`);
    }

    // Push new response data into the array
    updateResponse.response.push(...data);

    // Update the document in the collection
    await MarriageSchema.updateOne(
      { _id: new ObjectId(id) },
      { $set: { response: updateResponse.response } }
    );

    // console.log("Updated Marriage Response:", updateResponse);
  } catch (error) {
    console.error("Error in updateMarriageResponse:", error);
  }
};



const updateTempleResponse = async (id, data) => {
  try {
    const TempleSchema = db.collection("TempleDetailsGreetings"); // Correct collection name

    // Find the document by ID using MongoDB driver
    const updateResponse = await TempleSchema.findOne({ _id: new ObjectId(id) });

    if (!updateResponse) {
      throw new Error(`Temple details not found with id: ${id}`);
    }

    // Push new response data into the array
    updateResponse.response.push(...data);

    // Update the document in the collection
    await TempleSchema.updateOne(
      { _id: new ObjectId(id) },
      { $set: { response: updateResponse.response } }
    );

    // console.log("Updated Temple Response:", updateResponse);
  } catch (error) {
    console.error("Error in updateTempleResponse:", error);
  }
};


const saveResponse = async (data) => {
  try {
    const MailResponse = db.collection("mailresponse"); // The collection you're working with

    // Insert multiple documents into the collection
    const saveData = await MailResponse.insertMany(data);

    // console.log("Saved email responses:", saveData);

    // Return the inserted document IDs
    return saveData.insertedIds ? Object.values(saveData.insertedIds) : [];
  } catch (error) {
    console.log("Error in the saveResponse:", error);
    return [];
  }
};



const fetchSchedules = async (schedule, type) => {
  try {
    const scheduleSchema = db.collection("scheduledetails"); // The collection you're working with

    // Fetch schedules based on the `schedule` parameter
    const schedules = await scheduleSchema.find({ schedule:  schedule}).toArray(); // Convert cursor to array

    // Filter schedules based on the specified `type`
    // console.log(schedules);
    return schedules.filter((item) => item[type]);

  } catch (error) {
    console.error("Error in the fetchSchedules function:", error);
    return [];
  }
};



export { getBirthDayData, getEventData, getFestivalData, getMarriageData, getTempleData, updateBirthDayResponse, updateEventResponse, updateFestivalResponse, updateMarriageResponse, updateTempleResponse, saveResponse, fetchSchedules };
