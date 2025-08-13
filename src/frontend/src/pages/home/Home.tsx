import React from 'react';
import './styles.css';
import { Typography } from "@mui/material";

const Home = () => {
    return (
        <>
            <div className="container">
                <div className="topHalf">
                    <div className="leftHalf">
                        <span className="header">
                            <img src="/Graduation Photo.jpg" className="logo" aria-hidden="true" />
                            <Typography component='h1' variant='h4' data-testid='home-heading'>Cara Maxson</Typography>
                        </span>
                        <Typography component='h2' variant='h6' color='textSecondary' sx={{ mt: 1.5 }} data-testid='landing-subheading'>
                            2025 CTA Student
                        </Typography>
                        <Typography component='h6' variant='h6' color='textSecondary' sx={{ mt: 1.5 }} data-testid='landing-subheading'>
                            I graduated from UVA Engineering with a major in Computer Science and a minor in Data Science. I'm excited
                            to have joined CarMax this Summer! I have experience through my 2024 internship with CarMax in deploying kubernetes, secure and reliable web applications using various frameworks and technologies. I enjoy
                            improving cluster security, and learning Azure cloud infrastructure. I am passionate about creating high-quality code
                            that improves processes. I am always looking for new challenges and opportunities to grow as a developer.
                        </Typography>
                        <aside className="socialLinks">
                            <a target="_blank" href="https://x.com" rel="noopener noreferrer">
                                <img src="/twitter.png" alt="link to twitter" className="socialLink" />
                            </a>
                            <a target="_blank" href="https://facebook.com" rel="noopener noreferrer">
                                <img src="/facebook.png" alt="link to facebook" className="socialLink" />
                            </a>
                            <a target="_blank" href="https://www.linkedin.com/in/liberty-vanty/" rel="noopener noreferrer">
                                <img src="/linkedin.png" alt="link to linkedin" className="socialLink" />
                            </a>
                        </aside>
                    </div>
                    <div className="rightHalf">
                        <figure>
                            <img src="/college-graduate.png" className="largeImage" aria-hidden="true" />
                        </figure>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
