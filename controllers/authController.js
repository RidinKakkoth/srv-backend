import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';



export const createAdminUser = async () => {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt); // Default password

        const adminUser = new User({
            name: 'Admin',
            email: 'admin@gmail.com',  // Default admin email
            password: hashedPassword,
            role: 'admin',
        });

        await adminUser.save();
        console.log('Admin user created successfully!');
    } else {
        console.log('Admin user already exists.');
    }
};

// Register
export const register = async (req, res) => {

    
    const { name, email, password } = req.body;
    console.log(name,email,password);
   const userName = name?.trim();
    const userEmail = email?.trim();
    const userPassword = password?.trim();
    
    try {

        if (!userName || !userEmail || !userPassword) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email:userEmail });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }



        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userPassword, salt);

        const newUser = new User({
            name:userName,
            email:userEmail,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({success:true, message: ' Successfull, Please Login' });
    } catch (error) {
        res.status(500).json({ message: 'Error during registration', error });
    }
};

// Login 
export const login = async (req, res) => {
    const { email, password } = req.body;
    

    try {

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        console.log(user,"uuuuuuuuuuuu");
        
        if (!user) {
            return res.status(404).json({ message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
       
        
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }


        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });


        res.status(200).json({success:true,
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error during login', error });
    }
};
