const Booking = require('../models/Booking');
const Space = require('../models/Space');
const Client = require('../models/Client');

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private
exports.getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('spaceId', 'name type')
      .populate('clientId', 'name company')
      .sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('spaceId', 'name type capacity')
      .populate('clientId', 'name company email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    // Verify space and client exist
    const space = await Space.findById(req.body.spaceId);
    const client = await Client.findById(req.body.clientId);

    if (!space) {
      return res.status(404).json({
        success: false,
        message: 'Space not found'
      });
    }

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    // Add space and client names
    req.body.spaceName = space.name;
    req.body.clientName = client.name;

    const booking = await Booking.create(req.body);

    // Update space status if needed
    if (booking.status === 'confirmed') {
      await Space.findByIdAndUpdate(space._id, {
        status: 'occupied',
        currentBooking: {
          client: client.name,
          clientId: client._id,
          until: new Date(booking.date),
          date: booking.date
        }
      });
    }

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('spaceId').populate('clientId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Update space status based on booking status
    if (req.body.status) {
      if (req.body.status === 'cancelled') {
        await Space.findByIdAndUpdate(booking.spaceId._id, {
          status: 'available',
          $unset: { currentBooking: 1 }
        });
      } else if (req.body.status === 'confirmed') {
        await Space.findByIdAndUpdate(booking.spaceId._id, {
          status: 'occupied'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel/Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Update space status
    await Space.findByIdAndUpdate(booking.spaceId, {
      status: 'available',
      $unset: { currentBooking: 1 }
    });

    await Booking.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};

