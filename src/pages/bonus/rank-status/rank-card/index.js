import React from "react";
import { Box, Card, Button, Typography } from "@mui/material";
import Icon from "src/@core/components/icon";
import { formatNumber, kgcToUSDC, toFixedDecimal } from "src/constants/common";
import useGetUSDCTokens from "src/hooks/useGetUSDCTokens";

const RankCard = ({ rank, index }) => {
  const {
    title,
    qualified,
    selfBusiness,
    directTeam,
    directBussiness,
    totalTeamBusiness,
    totalTeamSize,
    qualification,
  } = rank;

  const renderStars = (title) => {
    const starCount = parseInt(title?.split(" ")[0]);
    return (
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        {Array?.from({ length: starCount }, (_, index) => (
          <Icon
            key={index}
            icon="bi:star-fill"
            fontSize={20}
            color={"#C9A84C"}
          />
        ))}
      </Box>
    );
  };

  const {
    tokenBlnc: selfBusinessValue,
  } = useGetUSDCTokens(selfBusiness?.value);
  const {
    tokenBlnc: selfBusinessRequiredValue,
  } = useGetUSDCTokens(selfBusiness?.requiredValue);
  const {
    tokenBlnc: directTeamBusinessValue,
  } = useGetUSDCTokens(directBussiness?.value);
  const {
    tokenBlnc: directTeamBusinessRequiredValue,
  } = useGetUSDCTokens(directBussiness?.requiredValue);
  const {
    tokenBlnc: totalTeamBusinessValue,
  } = useGetUSDCTokens(totalTeamBusiness?.value);
  const {
    tokenBlnc: totalTeamBusinessRequiredValue,
  } = useGetUSDCTokens(totalTeamBusiness?.requiredValue);


  const getImageSource = (title) => {
    const imageName = title?.replace(/\s/g, '');
    return `/images/pages/${imageName}.jpg`;
  };

  return (
    <Card>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mt: 4,
          pb: 3,
          borderBottom: 1,
        }}
      >
        {renderStars(title)}
        <Typography>{qualified ? "Qualified" : "Not Qualified"}</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mt: 4,
          borderBottom: 1,
        }}
      >
        <Box>
          <img
            style={{ width: "200px" }}
            src={getImageSource(title)}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mt: 4,
          borderBottom: 1,
        }}
      >
        <Typography>
          <h1>Conditions</h1>
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mt: 4,
          pb: 3,
        }}
      >
        {/* <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            mt: 4,
            pb: 3,
            borderBottom: 1,
          }}
        >
          <Box>
            Direct Team : {directTeam?.value} / {directTeam?.requiredValue || 0}{" "}
            <Typography
              variant="span"
              sx={{
                color: directTeam?.status ? "green" : "#C9A84C",
                pl: 2,
                fontSize: 22,
              }}
            >
              {directTeam?.status ? "√" : "x"}
            </Typography>
          </Box>
        </Box> */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            mt: 4,
            pb: 3,
            borderBottom: 1,
          }}
        >
          <Box>
            Self Business : $
            {selfBusinessValue
              ? selfBusinessValue
              : 0}{" "}
            / ${selfBusinessRequiredValue
              ? selfBusinessRequiredValue
              : 0}{" "}
            <Typography
              variant="span"
              sx={{
                color: selfBusiness?.status ? "green" : "#C9A84C",
                pl: 2,
                fontSize: 22,
              }}
            >
              {selfBusiness?.status ? "√" : "x"}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            mt: 4,
            pb: 3,
            borderBottom: 1,
          }}
        >
          <Box>
            Direct Business: $
            {directTeamBusinessValue
              ? directTeamBusinessValue
              : 0}{" "}
            / ${directTeamBusinessRequiredValue
              ? directTeamBusinessRequiredValue
              : 0}{" "}
            <Typography
              variant="span"
              sx={{
                color: directBussiness?.status ? "green" : "#C9A84C",
                pl: 2,
                fontSize: 22,
              }}
            >
              {directBussiness?.status ? "√" : "x"}
            </Typography>
          </Box>
        </Box>
        {/* {index === 3 || index === 4 || index === 5 || index === 6 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              mt: 4,
              pb: 3,
              borderBottom: 1,
            }}
          >
            <Box>
              Qualification : {qualification?.value}{" "}/
              {" "}{qualification?.requiredValue}{" "}
              <Typography
                variant="span"
                sx={{
                  color: qualification?.status ? "green" : "#C9A84C",
                  pl: 2,
                  fontSize: 22,
                }}
              >
                {qualification?.status ? "√" : "x"}
              </Typography>
            </Box>
          </Box>
        ) : (
          <>
          <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            mt: 4,
            pb: 3,
            borderBottom: 1,
          }}
          >
          <Box>
            Total Team Business: $
            {totalTeamBusinessValue
              ? totalTeamBusinessValue
              : 0}{" "}
            / ${totalTeamBusinessRequiredValue
              ? totalTeamBusinessRequiredValue
              : 0}{" "}
            <Typography
              variant="span"
              sx={{
                color: totalTeamBusiness?.status ? "green" : "#C9A84C",
                pl: 2,
                fontSize: 22,
              }}
            >
              {totalTeamBusiness?.status ? "√" : "x"}
            </Typography>
          </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              mt: 4,
              pb: 3,
              borderBottom: 1,
            }}
          >
            <Box>
              Total Active Team: {totalTeamSize?.value} /{" "}
              {totalTeamSize?.requiredValue || 0}{" "}
              <Typography
                variant="span"
                sx={{
                  color: totalTeamSize?.status ? "green" : "#C9A84C",
                  pl: 2,
                  fontSize: 22,
                }}
              >
                {totalTeamSize?.status ? "√" : "x"}
              </Typography>
            </Box>
          </Box>
          </>
        )} */}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mt: 6,
          pb: 6,
        }}
      >
        <Button type="submit" sx={{ mr: 2, py: 4 }} variant="contained">
          {qualified ? "Qualified" : "Not Qualified"}
        </Button>
      </Box>
    </Card>
  );
};

export default RankCard;