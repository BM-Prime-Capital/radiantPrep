import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // true pour le port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const { parentEmail, parentPassword, childName, childGrade, childSubject } = await request.json();

    // Vérification de l'existence de l'utilisateur
    const existingUser = await prisma.user.findUnique({
      where: { email: parentEmail }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }

    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(parentPassword, 10);
    
    // Génération du code d'accès
    const accessCode = generateAccessCode();

    // Création du compte parent
    const parentUser = await prisma.user.create({
      data: {
        email: parentEmail,
        passwordHash: hashedPassword,
        role: 'PARENT'
      }
    });

    // Création du compte enfant
    const childUser = await prisma.user.create({
      data: {
        role: 'CHILD',
        childName,
        grade: `GRADE_${childGrade}` as any,
        currentSubject: childSubject,
        accessCode,
        parentId: parentUser.id // Liaison parent-enfant
      }
    });

    // Envoi de l'email au parent
    // await transporter.sendMail({
    //   from: `"Radiant Prep" <${process.env.EMAIL_FROM || 'no-reply@radiantprep.com'}>`,
    //   to: parentEmail,
    //   subject: `Code d'accès pour ${childName}`,
    //   html: `
    //     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    //       <h1 style="color: #2563eb;">Bienvenue sur Radiant Prep!</h1>
    //       <p>Vous avez inscrit votre enfant <strong>${childName}</strong> (Grade ${childGrade}, ${childSubject}).</p>
          
    //       <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0; text-align: center;">
    //         <h2 style="margin: 0; color: #2563eb;">Code d'accès unique:</h2>
    //         <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 10px 0;">${accessCode}</p>
    //       </div>

    //       <p>Ce code permettra à votre enfant de se connecter à la plateforme.</p>
    //       <p style="font-size: 12px; color: #6b7280;">
    //         Si vous n'avez pas effectué cette inscription, veuillez ignorer cet email.
    //       </p>
    //     </div>
    //   `,
    // });

    await transporter.sendMail({
        from: `"Radiant Prep" <${process.env.EMAIL_FROM || 'no-reply@radiantprep.com'}>`,
        to: parentEmail,
        subject: `Your Child's Access Code for Radiant Prep`,
        html: `
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <div style="background-color: #2563eb; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Radiant Prep</h1>
            </div>
            
            <div style="padding: 20px;">
                <h2 style="color: #2563eb;">Welcome to Radiant Prep!</h2>
                <p>Dear Parent,</p>
                
                <p>Thank you for registering your child <strong>${childName}</strong> (Grade ${childGrade}, ${childSubject}) on our educational platform.</p>
                
                <div style="background-color: #f3f4f6; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #2563eb;">Your Child's Access Code</h3>
                <div style="font-size: 24px; font-weight: bold; letter-spacing: 2px; padding: 10px; background: white; text-align: center; border: 1px dashed #2563eb;">
                    ${accessCode}
                </div>
                <p style="margin-bottom: 0;">This unique code will allow your child to access their learning platform.</p>
                </div>

                <p><strong>Next Steps:</strong></p>
                <ol>
                <li>Share this code with your child</li>
                <li>Have your child visit our login page</li>
                <li>Enter the access code to begin learning</li>
                </ol>

                <p>If you did not request this registration, please ignore this email or contact our support team.</p>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
                <p>© ${new Date().getFullYear()} Radiant Prep. All rights reserved.</p>
                <p>123 Education Street, Learning City, 10001</p>
                </div>
            </div>
            </div>
        `,
        text: `Dear Parent,

        Thank you for registering your child ${childName} (Grade ${childGrade}, ${childSubject}) on Radiant Prep.

        Your Child's Access Code: ${accessCode}

        This unique code will allow your child to access their learning platform.

        Next Steps:
        1. Share this code with your child
        2. Have your child visit our login page
        3. Enter the access code to begin learning

        If you did not request this registration, please ignore this email.

        © ${new Date().getFullYear()} Radiant Prep
        123 Education Street, Learning City, 10001`
    });

    return NextResponse.json({
      success: true,
      message: 'Registration successful and access code emailed',
      child: {
        name: childUser.childName,
        grade: childUser.grade,
        subject: childUser.currentSubject
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}

function generateAccessCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}