import { Grid, Box, ScopedCssBaseline } from "@mui/material";
import { Typography, List, ListItem } from "@mui/material";

function Footer() {
  const footerSections = [
    {
      title: "Staycation.",
      links: [
        { text: "beauty holiday instantly and memorable." },
        { text: "" },
        { text: "" },
      ],
    },
    {
      title: "For Beginners",
      links: [
        { text: "New Account" },
        { text: "Start Booking a Room" },
        { text: "Use Payments" },
      ],
    },
    {
      title: "Connect Us",
      contactInfo: [
        { text: "support@staycation.id" },
        { text: "021 - 2208 - 1996" },
        { text: "Staycation, Jakarta" },
      ],
    },
    {
      title: "Explore Us",
      links: [
        { text: "Our Careers" },
        { text: "Privacy" },
        { text: "Terms & Conditions" },
      ],
    },
  ];

  return (
    <ScopedCssBaseline
      sx={{ py: 4, backgroundColor: "#f5f5f5", marginTop: "auto" }}
    >
      <Box component="footer">
        <Grid
          container
          spacing={4}
          // 👈 أفضل من center لتنسيق القوائم من الأعلى بشكل احترافي
          sx={{
             justifyContent:"space-between",
          alignItems:"flex-start",
            pl: { xs: "2rem", md: "8rem" },
          }}
        >
          {footerSections.map((section, index) => (
            <Grid key={index} item xs={12} sm={6} md={3}>
              {/* 🎯 قمنا بحل مشكلة التداخل بفصل العنوانين تماماً ومنع وضع Typography داخل Typography */}
              {index === 0 ? (
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    mb: 2
                  }}
                >
                  <span style={{ color: "#007BFF" }}>Stay</span>
                  <span style={{ color: "black" }}>cation.</span>
                </Typography>
              ) : (
                <Typography
                  variant="h6"
                  sx={{
                    color: "rgba(21, 44, 91, 1)",
                    fontSize: "18px",
                    fontWeight: "600",
                    textAlign: "left",
                    mb: 2 // 👈 بديل ممتاز لـ gutterBottom للتحكم بالمسافة بشكل أدق
                  }}
                >
                  {section.title}
                </Typography>
              )}

              {/* القوائم والروابط */}
              {section.links && (
                <List disablePadding>
                  {section.links.map((link, linkIndex) => (
                    <ListItem
                      key={linkIndex}
                      disableGutters
                      sx={{
                        color: "rgba(176, 176, 176, 1)",
                        py: 0.5, // مسافات عمودية متناسقة بين الروابط
                      }}
                    >
                      {link.text}
                    </ListItem>
                  ))}
                </List>
              )}

              {section.contactInfo && (
                <List disablePadding>
                  {section.contactInfo.map((info, infoIndex) => (
                    <ListItem
                      key={infoIndex}
                      disableGutters
                      sx={{
                        color: "rgba(176, 176, 176, 1)",
                        py: 0.5,
                      }}
                    >
                      {info.text}
                    </ListItem>
                  ))}
                </List>
              )}
            </Grid>
          ))}
        </Grid>

        {/* الكوبي رايت السفلية */}
        <Typography
          variant="body1"
          sx={{
            fontWeight: "bold",
            margin: "auto",
            color: "rgba(176, 176, 176, 1)",
            marginTop: "2.5rem",
            textAlign: "center"
          }}
        >
          Copyright 2019 • All rights reserved • Staycation
        </Typography>
      </Box>
    </ScopedCssBaseline>
  );
}

export default Footer;