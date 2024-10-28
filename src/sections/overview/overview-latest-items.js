import { formatDistanceToNow } from 'date-fns';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import EllipsisVerticalIcon from '@heroicons/react/24/solid/EllipsisVerticalIcon';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  SvgIcon
} from '@mui/material';
import Link from 'next/link';
import { itemImage, storeImage, toTitleCase } from 'src/utils/util';

export const OverviewLatestItems = (props) => {
  const { products = [], sx } = props;

  return (
    <Card sx={sx}>
      <CardHeader title="Latest Items" />
      <List>
        {products.map((product, index) => {
          const hasDivider = index < products.length - 1;
          const ago = formatDistanceToNow(product.updatedAt);

          return (
            <ListItem
              divider={hasDivider}
              key={product.slug}
            >
              <ListItemAvatar>
                {
                  product.avtar
                    ? (
                      <Box
                        component="img"
                        src={itemImage+product.slug+"/"+product.avtar}
                        sx={{
                          borderRadius: 1,
                          height: 48,
                          width: 48
                        }}
                      />
                    )
                    : (
                      <Box
                        sx={{
                          borderRadius: 1,
                          backgroundColor: 'neutral.200',
                          height: 48,
                          width: 48
                        }}
                      />
                    )
                }
              </ListItemAvatar>
              <ListItemText
                primary={toTitleCase(product.name)}
                primaryTypographyProps={{ variant: 'subtitle1' }}
                secondary={`Updated ${ago} ago`}
                secondaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Link
          href={{pathname : "/items" }} 
          style={{textDecoration : 'none'}}>
            
        <Button
          color="inherit"
          endIcon={(
            <SvgIcon fontSize="small">
              <ArrowRightIcon />
            </SvgIcon>
          )}
          size="small"
          variant="text"
        >
          View all
        </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

OverviewLatestItems.propTypes = {
  products: PropTypes.array,
  sx: PropTypes.object
};
