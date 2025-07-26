import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const {
      parentEmail,
      parentPassword,
      parentFirstName,
      parentLastName,
      childFirstName,
      childLastName,
      childGrade
    } = await request.json();

    const existingUser = await prisma.user.findUnique({
      where: { email: parentEmail }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(parentPassword, 10);
    const accessCode = generateAccessCode();

    const parentUser = await prisma.user.create({
      data: {
        email: parentEmail,
        passwordHash: hashedPassword,
        role: 'PARENT'
      }
    });

    const childUser = await prisma.user.create({
      data: {
        role: 'CHILD',
        childName: `${childFirstName} ${childLastName}`,
        grade: `GRADE_${childGrade}` as any,
        accessCode,
        parentId: parentUser.id,
      }
    });

    // await transporter.sendMail({
    //   from: `"Radiant Prep" <${process.env.EMAIL_FROM || 'no-reply@radiantprep.com'}>`,
    //   to: parentEmail,
    //   subject: `Your Child's Access Code for Radiant Prep`,
    //   html: `
    //     <div style="font-family: Arial; max-width: 600px;">
    //       <h1>Welcome to Radiant Prep</h1>
    //       <p>You have registered <strong>${childFirstName}</strong> in Grade ${childGrade}.</p>
    //       <p><strong>Access Code:</strong> <code>${accessCode}</code></p>
    //       <p>Share this code with your child so they can log in to the platform.</p>
    //     </div>
    //   `,
    // });

    await transporter.sendMail({
      from: `"CompleMetrics" <${process.env.EMAIL_FROM || 'no-reply@complemetrics.com'}>`,
      to: parentEmail,
      subject: `Your Child's Access Code for CompleMetrics`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          
          <div style="background-color: #f9fafb; padding: 24px; text-align: center;">
            <img src="cid:complemetrics-logo" alt="CompleMetrics Logo" style="width: 240px; max-width: 100%; height: auto;" />
          </div>

          <div style="padding: 24px;">
            <h2 style="color: #008040; margin-bottom: 0;">Welcome to <span style="color: #C000A0;">Comple</span><span style="color: #008040;">Metrics</span>!</h2>
            <p style="margin-top: 0;">Thank you for registering your child <strong>${childFirstName} ${childLastName}</strong> in Grade ${childGrade}.</p>
            
            <div style="background-color: #f3f4f6; border-left: 4px solid #008040; padding: 16px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #C000A0;">Your Child's Access Code</h3>
              <div style="font-size: 24px; font-weight: bold; letter-spacing: 2px; padding: 12px; background: white; text-align: center; border: 2px dashed #C000A0;">
                ${accessCode}
              </div>
            </div>

            <p><strong>Next Steps:</strong></p>
            <ol style="padding-left: 20px;">
              <li>Share this code with your child</li>
              <li>Visit the login page</li>
              <li>Enter the access code to begin learning</li>
            </ol>

            <p>If you did not request this registration, please ignore this email or contact our team.</p>
          </div>

          <div style="text-align: center; padding: 16px; background-color: #f9fafb; font-size: 12px; color: #999;">
            &copy; ${new Date().getFullYear()} CompleMetrics. All rights reserved.
          </div>
        </div>
      `,
      attachments: [
        {
          filename: 'logo-complemetrics.png',
          path: './public/logo-complemetrics.png', // ou donne le bon chemin si différent
          cid: 'complemetrics-logo' // doit matcher le cid dans <img src="cid:complemetrics-logo">
        }
      ],
    });


    return NextResponse.json({
      success: true,
      message: 'Registration successful and access code emailed',
      child: {
        name: childUser.childName,
        accessCode,
        grade: childUser.grade,
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'An error occurred during registration' }, { status: 500 });
  }
}

function generateAccessCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}
