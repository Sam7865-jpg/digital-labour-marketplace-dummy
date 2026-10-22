import WorkerProfile from '../models/WorkerProfile.js';

// GET: /api/workers/profile (Apna profile dekhna)
export const getWorkerProfile = async (req, res) => {
  try {
    const profile = await WorkerProfile.findOne({ user: req.user._id }).populate('user', 'name email phone');
    if (!profile) {
      return res.status(404).json({ message: 'Worker profile abhi nahi bana hua' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST / PUT: /api/workers/profile (Profile create ya update karna)
export const updateWorkerProfile = async (req, res) => {
  try {
    // Frontend aur backend dono ke field names ko support karne ke liye
    const { 
      title, occupation, 
      category, 
      experience, experienceYears, 
      hourlyRate, 
      location, city, address, 
      bio 
    } = req.body;

    const finalOccupation = title || occupation;
    const finalExperience = experience ?? experienceYears;
    const finalLocation = location || city;

    let profile = await WorkerProfile.findOne({ user: req.user._id });

    if (profile) {
      // Agar pehle se bana hua hai to UPDATE karein
      profile.occupation = finalOccupation || profile.occupation;
      if (category) profile.category = category;
      profile.experienceYears = finalExperience ?? profile.experienceYears;
      profile.hourlyRate = hourlyRate ?? profile.hourlyRate;
      profile.city = finalLocation || profile.city;
      if (address) profile.address = address;
      if (bio) profile.bio = bio;

      await profile.save();
      return res.json({ message: 'Profile update ho gaya', profile });
    }

    // Agar pehli dafa bana raha hai to CREATE karein
    profile = await WorkerProfile.create({
      user: req.user._id,
      occupation: finalOccupation || 'Worker',
      category: category || 'General',
      experienceYears: finalExperience || 0,
      hourlyRate: hourlyRate || 0,
      city: finalLocation || 'Not specified',
      address: address || '',
      bio: bio || '',
    });

    res.status(201).json({ message: 'Profile kamyabi se ban gaya', profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};