import { gql } from '@apollo/client';

export const SPECIAL_PRODUCT = gql`
 query GetSpecialProductList($size: Int!)  {
  getMstSpecialList(
    specialId: null,
    specialName: null,
    franchiseId: null,
    statusIds: null,
    distance: null,
    companyIds: null,
    categoryIds: null,
    provinceIds: null,
    cityIds: null,
    suburbIds: null,
    page: 1,
    size: $size
  ){
    count,
    currentPage,
    message,
    nextPage,
    prevPage,
    success,
    totalPages,
    result{
      amount,
      categoryID,
      categoryIds,
      categoryName,
      cityID,
      cityIds,
      cityName,
      companyIds,
      countryID,
      countryName,
      dis,
      distance,
      documentLink,
      endDate,
      franchiseId,
      imagePath,
      latitude,
      longitude,
      phone,
      provinceID,
      provinceIds,
      provinceName,
      specialDescription,
      specialId,
      specialID,
      specialName,
      staId,
      startDate,
      statusId,
      statusID,
      statusName,
      streetAddress,
      suburb,
      suburbID,
      suburbIds,
      userId,
      userLatitude,
      userLongtitude,
      zipCode,
      mapSpecialUpload{        
        uploadPath,
        thumbNailPath
      }  
    }
    
  }
}
`;

export const SPECIAL_PRODUCT_LIST_WITH_DISTANCE = gql`
 query GetSpecialProductList($distance: Decimal!)  {
  getMstSpecialList(
    specialId: null,
    specialName: null,
    franchiseId: null,
    statusIds: null,
    distance: $distance,
    companyIds: null,
    categoryIds: null,
    provinceIds: null,
    cityIds: null,
    suburbIds: null,
    page: 1,
    size: 10
  ){
    count,
    currentPage,
    message,
    nextPage,
    prevPage,
    success,
    totalPages,
    result{
      amount,
      categoryID,
      categoryIds,
      categoryName,
      cityID,
      cityIds,
      cityName,
      companyIds,
      countryID,
      countryName,
      dis,
      distance,
      documentLink,
      endDate,
      franchiseId,
      imagePath,
      latitude,
      longitude,
      phone,
      provinceID,
      provinceIds,
      provinceName,
      specialDescription,
      specialId,
      specialID,
      specialName,
      staId,
      startDate,
      statusId,
      statusID,
      statusName,
      streetAddress,
      suburb,
      suburbID,
      suburbIds,
      userId,
      userLatitude,
      userLongtitude,
      zipCode,
      mapSpecialUpload{        
        uploadPath,
        thumbNailPath
      }  
    }
    
  }
}
`;

export const GET_PRODUCT = gql`
query GetPrdProductList($size: Int!, $categories: String = null) {
    getPrdProductList(
       productName: null,
       productId: null,
       categoryId: null,
       domainCategoryIds:$categories,
       status: null,
       salesTypeId: null,
       scopeId:null,
       userId:null,
       page:1, size:$size){
       count,
       currentPage,    
       message,
       nextPage,
       prevPage,
       success,
       totalPages,
       result{
         activeText,
         categoryID,
         categoryName,
         description,
         documentName,
         documentPath,
         isActive,
         ratingScore,
         productID,
         productImage,
         productName,
         productNumber,
         salesTypeId,
         typeID,
         inventory,
         clickCount,
         viewCount
         unitCost,
         length, 
         width, 
         height, 
         volume, 
         weight, 
         googleSchema,
         domainCategory, 
         startDate,
         endDate,
       mapProductImages{        
           imageName,
           imagePath
         }   
         prdBid{
           bidId,
           createdDate,
           bidAmount,
           userId
         }
         prdHire{
           hireId, 
           userId,
           isAccepted,
           fromDate, 
           toDate,
           returned
         }
        
       }
     }
   }
`;
export const GET_SINGLE_PRODUCT = gql`
query GetPrdProductList($productId: Int!) {
    getPrdProductList(
       productName: null,
       productId: $productId,
       categoryId: null,
       domainCategoryIds:null,
       status: null,
       salesTypeId: null,
       scopeId:null,
       userId:null,
       page:1, size:10){
       count,
       currentPage,    
       message,
       nextPage,
       prevPage,
       success,
       totalPages,
       result{
         activeText,
         categoryID,
         categoryName,
         description,
         documentName,
         documentPath,
         isActive,
         ratingScore,
         productID,
         productImage,
         productName,
         productNumber,
         salesTypeId,
         typeID,
         inventory,
         clickCount,
         viewCount
         unitCost,
         length, 
         width, 
         height, 
         volume, 
         weight, 
         googleSchema,
         domainCategory, 
         startDate,
         endDate,
       mapProductImages{        
           imageName,
           imagePath
         }   
         prdBid{
           bidId,
           createdDate,
           bidAmount,
           userId
         }
         prdHire{
           hireId, 
           userId,
           isAccepted,
           fromDate, 
           toDate,
           returned
         }
        
       }
     }
   }
`;



export const GET_PRODUCT_PURCHASE = gql`
query GetPrdProductList($size: Int!) {
  getPrdProductList(
    productName: null,
    productId: null,
    categoryId: null,
    domainCategoryIds:null,
    status: null,
    salesTypeId: 1,
    scopeId:null,
    userId:null,
    page:1, size:$size){
    count,
    currentPage,    
    message,
    nextPage,
    prevPage,
    success,
    totalPages,
    result{
      activeText,
      categoryID,
      categoryName,
      description,
      documentName,
      documentPath,
      isActive,
      ratingScore,
      productID,
      productImage,
      productName,
      productNumber,
      salesTypeId,
      typeID,
      inventory,
      clickCount,
      viewCount
      unitCost,
      length, 
      width, 
      height, 
      volume, 
      weight, 
      googleSchema,
      domainCategory, 
      startDate,
      endDate,
	  mapProductImages{        
        imageName,
        imagePath
      }   
      prdBid{
        bidId,
        createdDate,
        bidAmount,
        userId
      }
      prdHire{
        hireId, 
        userId,
        isAccepted,
        fromDate, 
        toDate,
        returned
      }
     
    }
  }
}
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($pid: Int!,$userid: Int!,$dateCreated: DateTime, $fromDate: String = null, $endDate: String = null, $quantity: Int = 1) {
    postPrdShoppingCartOptimized(
      prdShoppingCart: {
        productId: $pid
        dateCreated: $dateCreated
        quantity: $quantity
        fromDate: $fromDate
        endDate: $endDate
        userId: $userid
      }
    ) {
      count
      currentPage
      message
      nextPage
      prevPage
      success
      totalPages
      result {
        prdShoppingCartDto {
          categoryID
          categoryName
          description
          productID
          productImage
          productName
          productNumber
          quantity
          recordID
          totalPrice
          unitCost
        }
        totalAmount,
        amountExlVat,
        vatAmount,
        recuringAmount
      }
    }
  }
`;


export const ADD_TO_CART_NULL = gql`
  mutation AddToCart($pid: Int!, $dateCreated: DateTime) {
      postPrdShoppingCartOptimized(
        prdShoppingCart: {
          productId: $pid
          dateCreated: $dateCreated
          quantity: 1
          fromDate: null
          endDate: null
          userId: null
        }
      ) {
        count
        currentPage
        message
        nextPage
        prevPage
        success
        totalPages
        result {
          prdShoppingCartDto {
            categoryID
            categoryName
            description
            productID
            productImage
            productName
            productNumber
            quantity
            recordID
            totalPrice
            unitCost
          }
          totalAmount,
          amountExlVat,
          vatAmount,
          recuringAmount
        }
      }
    }
    
`;
export const GIVE_BUSINESS_RATING = gql`
 mutation PostMstRating(
   $reviewData: String!
   $companyId: Int!
   $specialId: Int!
   $eflyerId: Int!
   $ratingScore: Int!
   $userId:Int!
   ) {
  postMstRating(
    mstRating: {
      	mstRatingId: 0,
        companyId: $companyId,
        specialId: $specialId,
        eflyerId: $eflyerId,
        userId: $userId,
        name: "",
        contactNo: "",
        emaiId: "",
        review: $reviewData,
        ratingScore: $ratingScore,
        statusId: 0,
        productId: 0
    }
  ){
    count,
    currentPage,
    message,
    nextPage,
    prevPage,
    success,
    totalPages,
    result
  }
}
`;
export const HANDLE_SIGNUP = gql`
  mutation RegisterUser(
    $name: String!
    $lname: String!
    $email: String!
    $contactNo: String!
    $password: String!
    $track: Int!
    $gid: String!
    $fBAccessCode: String!
    $facebookUserID: String!
    $deviceID: String!
    $deviceType: Int
    $latitude:String
    $longitude:String
  ) {
    registerUser(
      userDto: {
        fBAccessCode: $fBAccessCode
        facebookUserID: $facebookUserID
        googleUserID: $gid
        linkedInUserID: ""
        twitterUserId: ""
        instagramUserID: ""
        email: $email
        contactNo: $contactNo
        userName: $email
        firstName: $name
        lastName: $lname
        password: $password
        track: $track
        domainUrl: "1",
        deviceID: $deviceID
        deviceType: $deviceType,
        latitude: $latitude,
        longitude: $longitude
      }
      platform: 1
    ) {
      count
      currentPage
      message
      nextPage
      prevPage
      success
      totalPages
      result {
        firstName
        lastName
        paymentUrl
        token
        tokenExpires
      }
    }
  }
`;

export const HANDLE_SIGNUP_BUSINESS = gql`
  mutation RegisterBusiness(
    $name: String!
    $lname: String!
    $email: String!
    $contactNo: String!
    $password: String!
    $companyName: String!
    $categoryId: Int,
    $provinceID: Int,
    $cityID: Int,
    $suburbID: Int,
    $packageID: Int,
    $deviceId: String,
    $deviceType: Int,
    $itemOff:Int,
    $latitude:String
    $longitude:String
  ) {
    registerBusiness(
      userDto: {
         email:$email,
         contactNo:$contactNo,
         companyName:$companyName,
         firstName:$name,
         lastName: $lname,
         password:$password,
         provinceID: $provinceID,
         cityID: $cityID,
         suburbID: $suburbID,
         categoryID: $categoryId,
         packageID:$packageID,
         domainUrl:"1",
         discount:$itemOff,
         deviceID: $deviceId,
         deviceType: $deviceType,
         latitude: $latitude,
         longitude: $longitude
      }
    ){
      count,
      currentPage,
      message,
      nextPage,
      prevPage,
      success,
      totalPages,
      result{
        firstName,
        lastName,
        paymentUrl,
        token,
        tokenExpires
      }
    }
  }
`;

export const CHECK_MAIL = gql`
  query EmailCheck($email: String!) {
    emailCheck(email: $email) {
      count
      currentPage
      message
      nextPage
      prevPage
      success
      totalPages
    }
  }
`;

export const MAIN_CATEGORY = gql`
  query {
    getMstCategoryMain {
      count
      currentPage
      message
      nextPage
      prevPage
      success
      totalPages
      result {
        categoryIcon
        categoryId
        categoryName
        categoryThumbNailIcon
        createdBy
        createdDate
        isActive
        isCategory
        isMainCategory
        isMenuAllowed
        modifiedBy
        modifiedDate
        parentCategoryId
        timeDelayException
      }
    }
  }
`;

export const SUB_CATEGORY = gql`
  query SubCategory($id: Int) {
    getMstCategoryByParentId(id: $id) {
      count
      currentPage
      message
      nextPage
      prevPage
      success
      totalPages
      result {
        categoryIcon
        categoryId
        categoryName
        categoryThumbNailIcon
        createdBy
        createdDate
        isActive
        isCategory
        isMainCategory
        isMenuAllowed
        modifiedBy
        modifiedDate
        parentCategoryId
        timeDelayException
      }
    }
  }
`;

export const GET_PROVINCE = gql`
  {
    getProvince {
      count
      currentPage
      message
      nextPage
      prevPage
      success
      totalPages
      result {
        countryId
        createdBy
        createdDate
        isActive
        modifiedBy
        modifiedDate
        provinceId
        provinceName
      }
    }
  }
`;

export const GET_CITY = gql`
  query GetCity($id: Int) {
    getCityByProvince(id: $id) {
      count
      currentPage
      message
      nextPage
      prevPage
      success
      totalPages
      result {
        cityId
        cityName
        createdBy
        createdDate
        isActive
        modifiedBy
        modifiedDate
        provinceId
      }
    }
  }
`;

export const GET_SUBURB = gql`
  query GetSuburb($id: Int) {
    getSuburbByCity(id: $id) {
      count
      currentPage
      message
      nextPage
      prevPage
      success
      totalPages
      result {
        cityId
        createdBy
        createdDate
        isActive
        modifiedBy
        modifiedDate
        suburbId
        suburbName
      }
    }
  }
`;

export const REQUEST_ITEM = gql`
  mutation MstItemRequest(
    $userId: Int
    $title: String
    $desc: String
    $catId: Int
    $date:DateTime
    $suburbId: Int
    $files: [Upload!]
  ) {
    postMstItemRequest(mstItemRequest:{
        itemRequestTitle: $title
        itemRequestDescription: $desc
        itemRequestDate: $date
        categoryId: $catId
        suburbId: $suburbId
        requestApprovedMail: false
        createdBy: $userId
        createdDate: $date
        modifiedDate: $date
      },
      files: $files
    ) {
      count
      currentPage
      message
      nextPage
      prevPage
      success
      totalPages
      result
    }
  }
`;


export const REQUEST_ITEM_GET = gql`
query GetRequestList($size: Int!) {
  getItemRequestList(
   itemRequestTitle: null,
     categoryIds: null,
     provinceIds: null,
     cityIds: null
     suburbIds: null
     page: 1
     size: $size
 ){
     count,
     currentPage,
     message,
     nextPage,
     prevPage,
     result{
       city,
       cityID,
       itemCategory,
       itemCategoryID,
       itemImagePath,
       itemRequestDate,
       itemRequestDescription,
       itemRequestID,
       itemRequestStatus,
       itemRequestStatusID,
       itemRequestTitle,
       mapItemRequestUploadDto{
         createdBy,
         createdDate,
         irUploadId,
         isActive,
         itemRequestId,
         modifiedBy,
         modifiedDate,
         thumbNailPath,
         uploadPath
       },
       province,
       provinceID,
       selectedCompany,
       suburb,
       suburbID,
       userID,
       userName
     },
     success,
     totalPages
   }
 }
`;

export const ENEQUIRY_ITEM_GET = gql`
 query GetEnquiryList($size: Int!){
  getCustomerEnquiryList(    
    page: 1,
    size: $size
  ){
    count,
    currentPage,
    message,
    nextPage,
    prevPage,
    success,
    totalPages,
    result{
       companyId,  
      enquiryTitle,
      enquiryDescription
      mstCustomerEnquiryResponse{        
        comment,
        responseDate
      }  
       mapCustomerEnquiryUpload{        
        customerEnquiryId,
        uploadPath,
        thumbNailPath
      }  

    }
    
  }
}
`;

export const REQUEST_ITEM_GET_INCOMING = gql`
query GetRequestList($size: Int!) {
  getIncomingItemRequestList(
    itemRequestTitle: null,
      categoryIds: null,
      provinceIds: null,
      cityIds: null
      suburbIds: null
      page: 1
      size: $size
  ){
      count,
      currentPage,
      message,
      nextPage,
      prevPage,
      result{
        city,
        cityID,
        itemCategory,
        itemCategoryID,
        itemImagePath,
        itemRequestDate,
        itemRequestDescription,
        itemRequestID,
        itemRequestStatus,
        itemRequestStatusID,
        itemRequestTitle,
        mapItemRequestUploadDto{
          createdBy,
          createdDate,
          irUploadId,
          isActive,
          itemRequestId,
          modifiedBy,
          modifiedDate,
          thumbNailPath,
          uploadPath
        },
        province,
        provinceID,
        selectedCompany,
        suburb,
        suburbID,
        userID,
        userName
      },
      success,
      totalPages
    }
  }
`;

export const GET_INCOMING_ENQURIES = gql`
query GetBusinessIncommingEnquries($page: Int!, $size: Int!){
  getBusinessIncomingEnquiry(    
    page: $page,
    size: $size
  ){
    count,
    currentPage,
    message,
    nextPage,
    prevPage,
    success,
    totalPages,
    result{
        customerEnquiryId,
       companyId,  
      enquiryTitle,
      enquiryDescription
      mstCustomerEnquiryResponse{        
        comment,
        responseDate
      }  
       mapCustomerEnquiryUpload{        
        customerEnquiryId,
        uploadPath,
        thumbNailPath
      }  

    }
  }
}`;

export const GET_BUSINESS = gql`
query GetBusinessList($size: Int!){
  getBusinessList(
    companyId: null
    companyName: null
    franchiseeId: null,
    statusIds:"",
    categoryIds:null,
    provinceIds:"",
    cityIds:"",
    suburbIds:""
    page: 1,
    size: $size
  ){
    count,
    currentPage,
    message,
    nextPage,
    prevPage,
    success,
    totalPages,
    result{
      bEEScorePoint,
      bEEStatus,
      bEEStatusID,
      companyId,
      companyName,
      companyPercentage,
      companyStatus,
      companyStatusID,
      compCityID,
      compCityName,
      compCountryID,
      compCountryName,
      compDescription,
      compEmailId,
      compHelpDeskNumber,
      compPhone,
      compProvinceID,
      compProvinceName,
      compStreetAddress,
      compSuburb,
      compSuburbID,
      compWebSite,
      directorsCount,
      franchiseId,
      intCompanyMBUDeviceID,
      intCompanyMBUDeviceType,
      intCompanyMBUEmail,
      intCompanyMBUName,
      joinDate,
      logoPath,
      procurementRecognition,
      serviceTax,
      vATNumber,
      zipCode
    }
    
  }
}
`;

export const GET_SALE_TYPE = gql`
  query {
    getPrdSalesType{ 
      count,
      currentPage,
      message,
      nextPage,
      prevPage,
      success,
      totalPages,
      result{
        salesTypeID,
        salesTypeName
      }
    }
  }
`;

export const GET_ALL_STATE = gql`
query
{
  getProvince{
     count,
     currentPage,
     message,
     nextPage,
     prevPage,
     success,
     totalPages,
     result{
       countryId,
       createdBy,
       createdDate,
       isActive,
       modifiedBy,
       modifiedDate,
       provinceId,
       provinceName
     }
   }
 }
 `;


export const GET_ALL_CITY_NEW = gql`
 query{
  getCity{
     count,
     currentPage,
     message,
     nextPage,
     prevPage,
     success,
     totalPages,
     result{
       cityId,
       cityName,
       createdBy,
       createdDate,
       isActive,
       modifiedBy,
       modifiedDate,
       provinceId
     }
   }
 }
`;

export const GET_ALL_SUBURB = gql`
 query{
  getSuburb{
     count,
     currentPage,
     message,
     nextPage,
     prevPage,
     success,
     totalPages,
     result{
       cityId,
       createdBy,
       createdDate,
       isActive,
       modifiedBy,
       modifiedDate,
       suburbId,
       suburbName
     }
   }
 }
`;

export const GUEST_LOGIN = gql`
 query
 {
   guestLogin{
     count,
     currentPage,
     message,
     nextPage,
     prevPage,
     success,
     totalPages,
     result{
       validTo,
       value
     }
   }
 }
`;

export const GET_SHOPPING_CART = gql`
{
  getPrdShoppingCart(page:1, size:20){
    count,
    currentPage,
    message,
    nextPage,
    prevPage,
    success,
    totalPages,
    result {
      prdShoppingCartDto {
        categoryID
        categoryName
        description
        productID
        productImage
        productName
        productNumber
        quantity
        recordID
        totalPrice
        unitCost
      }
      totalAmount,
      amountExlVat,
      vatAmount,
      recuringAmount
    }
  }
}`
  ;

export const GET_RATING = gql`
query GetRating($id: Int){
  getMstRatingScoreList(key:$id,keyType:1,page:1,size:10){
      count,
    currentPage,
    message,
    nextPage,
    prevPage,
    success,
    totalPages,
    result{
      ratingScore,
      ratingScoreName,
      ratingScoreCount,
      ratingScorePercent,
      totalRatingCount,
      totalRatingScore
    }
  }
}`

export const GET_PRODUCT_RATING = gql`
query GetProductRating($id: Int){
  getMstRatingScoreList(key:$id,keyType:4,page:1,size:10){
    count,
    currentPage,
    message,
    nextPage,
    prevPage,
    success,
    totalPages,
    result{
      ratingScore,
      ratingScoreName,
      ratingScoreCount,
      ratingScorePercent,
      totalRatingCount,
      totalRatingScore
    }
  }
}`;

export const GET_SPECIAL = gql`
query GetSpecialList($size: Int!){
  getMstSpecialList(
    specialId: null,
    specialName: null,
    franchiseId: null,
    statusIds: null,
    distance: null,
    companyIds: null,
    categoryIds: null,
    provinceIds: null,
    cityIds: null,
    suburbIds: null,
    page: 1,
    size: $size
  ){
    count,
    currentPage,
    message,
    nextPage,
    prevPage,
    success,
    totalPages,
    result{
      amount,
      categoryID,
      categoryIds,
      categoryName,
      cityID,
      cityIds,
      cityName,
      companyIds,
      countryID,
      countryName,
      dis,
      distance,
      documentLink,
      endDate,
      franchiseId,
      imagePath,
      latitude,
      longitude,
      phone,
      provinceID,
      provinceIds,
      provinceName,
      specialDescription,
      specialId,
      specialID,
      specialName,
      staId,
      startDate,
      statusId,
      statusID,
      statusName,
      streetAddress,
      suburb,
      suburbID,
      suburbIds,
      userId,
      userLatitude,
      userLongtitude,
      zipCode,
      mapSpecialUpload{        
        uploadPath,
        thumbNailPath
      }  
    }
    
  }
}`
  ;

export const GET_BLOGS_JOBS = gql`
  {
    getPostList(
      title: null,
      domainId: null,
      categoryId: null,
      companyId: null,
      location: null,
      page: 1,
      size: 10
    ){
      count,
      currentPage,
      message,
      nextPage,
      prevPage,
      success,
      totalPages,
      result{
        categoryID,
        companyID,
        companyName,
        description,
        descriptionSEO,
        documentName,
        domainID,
        endDate,
        filePath,
        keywordsSEO,
        location,
        name,
        postID,
        startDate,
        thumbNailImagePath,
        title,
        titleSEO
      }
      
    }
  }`
  ;

export const GET_BLOGS_COMMENTS = gql`
  {
    getPostList(
      title: null,
      domainId: null,
      categoryId: null,
      companyId: null,
      location: null,
      page: 1,
      size: 10
    ){
      count,
      currentPage,
      message,
      nextPage,
      prevPage,
      success,
      totalPages,
      result{
        categoryID,
        companyID,
        companyName,
        description,
        descriptionSEO,
        documentName,
        domainID,
        endDate,
        filePath,
        keywordsSEO,
        location,
        name,
        postID,
        startDate,
        thumbNailImagePath,
        title,
        titleSEO
      }
      
    }
  }`
  ;
export const GET_MAGAZINES_LIST = gql`
query GetMagazinesList($id: String!) {
  getMagazinesList(
  franchiseId: null,
  eflyerId: null,
  magazineName: null,
  statusIds: null,
  companyIds: $id,
  categoryIds: null,
  provinceIds: null,
  cityIds: null,
  suburbIds: null,
  page: 1,
  size: 10
  ){
  result{
  eflyerId,
  magazineName,
  eFlyerDescription,
  categoryID,
  categoryName,
  startDate,
  endDate,
  statusId,
  statusName,
  companyId,
  companyName,
  companyDescription,
  isMenu,
  streetAddress,
  countryID,
  countryName,
  provinceID,
  provinceName,
  cityID,
  cityName,
  suburbID,
  suburb,
  zipCode,
  phone,
  companyLocation
  mapEflyersUploadDtos{
  documentName
  }
  }
  }
  }`
  ;

export const REQUEST_ITEM_POST_RESPONSE = gql`
  mutation ItemRequest(
    $userId: Int
    $itemRequestId: Int
    $title: String
    $filePath: String
    $fileName:String
  ) {
    postMstItemResponse(mstItemResponse:{
    	comment: $title,
        companyId: null,
        createdBy: null,
        createdDate: null,
        isAccepted: null,
        isActive: null,
        isRejected: null,
        itemRequestId: $itemRequestId,
        itemResponseId: 0,
        modifiedBy: null,
        modifiedDate: null,
        replyToId: null,
        responseDate: "2015-06-23T17:35:44.68",
        userId: $userId,
    	  mapItemResponseUpload:{
      	createdBy: null,
        createdDate: "2015-08-14T13:27:23.747",
          documentName: $fileName,
          irUploadId: null,
          isActive: true,
          itemResponseId: null,
          modifiedBy: null,
          modifiedDate: null,
          uploadPath: $filePath
    		}
  	}
  ){
    count,
    currentPage,
    message,
    nextPage,
    prevPage,
    success,
    totalPages,
    result
  }
}

`;

export const GET_RESPONSE_ITEMS = gql`
query GetRespons($id: ID!) 
{
  getResponseItems(
   id: $id
 ){
     comment,
     companyId,
     createdBy,
     createdDate,
     isAccepted,
     isActive,
     isRejected,
     itemRequestId,
     itemResponseId,
     mapItemResponseUpload{
       createdBy,
       createdDate,
       documentName,
       irUploadId,
       isActive,
       itemResponseId,
       modifiedBy,
       modifiedDate,
       uploadPath
     }
     modifiedBy,
     modifiedDate,
     replyToId,
     responseDate,
     userId
   
   }
 }

`;

export const GET_RESPONSE_ITEMS_NEW = gql`
query GetRespons($id: ID!) 
{
  getResponseItems(
   id: $id
 ){
     comment,
     companyId,
     createdBy,
     createdDate,
     isAccepted,
     isActive,
     isRejected,
     itemRequestId,
     itemResponseId,
     mapItemResponseUpload{
       createdBy,
       createdDate,
       documentName,
       irUploadId,
       isActive,
       itemResponseId,
       modifiedBy,
       modifiedDate,
       uploadPath
     }
     modifiedBy,
     modifiedDate,
     replyToId,
     responseDate,
     userId
   
   }
 }

`;



export const GET_SPECIAL_LIST_BY_COMPANY = gql`
query GetSpecialList($id: String!) {
  getMstSpecialList(
    specialId: null,
    specialName: null,
    franchiseId: null,
    statusIds: null,
    distance: null,
    companyIds: null,
    categoryIds: $id,
    provinceIds: null,
    cityIds: null,
    suburbIds: null,
    page: 1,
    size: 10
  ){
    count,
    currentPage,
    message,
    nextPage,
    prevPage,
    success,
    totalPages,
    result{
      amount,
      categoryID,
      categoryIds,
      categoryName,
      cityID,
      cityIds,
      cityName,
      companyIds,
      countryID,
      countryName,
      dis,
      distance,
      documentLink,
      endDate,
      franchiseId,
      imagePath,
      latitude,
      longitude,
      phone,
      provinceID,
      provinceIds,
      provinceName,
      specialDescription,
      specialId,
      specialID,
      specialName,
      staId,
      startDate,
      statusId,
      statusID,
      statusName,
      streetAddress,
      suburb,
      suburbID,
      suburbIds,
      userId,
      userLatitude,
      userLongtitude,
      zipCode
    }
    
  }
}`
  ;

export const UPDATE_SHOPPING_CART_NEW = gql`
  mutation postPrdShoppingCartOptimized($pid: Int!,$quantity:Int!,$userid: Int!,$dateCreated: DateTime) {
    postPrdShoppingCartOptimized(
      prdShoppingCart: {
        productId: $pid
        dateCreated: $dateCreated
        quantity: $quantity
        fromDate: null
        endDate: null
        userId: $userid
      }
    ) {
      count
      currentPage
      message
      nextPage
      prevPage
      success
      totalPages
      result {
        prdShoppingCartDto {
          categoryID
          categoryName
          description
          productID
          productImage
          productName
          productNumber
          quantity
          recordID
          totalPrice
          unitCost
        }
        totalAmount,
        amountExlVat,
        vatAmount,
        recuringAmount
      }
    }
  }
`;

export const UPDATE_SHOPPING_CART = gql`
  mutation UpdateCart(
    $userId: Int
    $curdate: DateTime
    $pid: Int
    $quantity: Int
    $recordId:Int
    ) {
    updatePrdShoppingCart(
      prdShoppingCart: {
          dateCreated: $curdate,
          productId: $pid,
          quantity: $quantity,
          recordId: $recordId,
          sessionId: "lftmjajx2rllpts5z3sp4i2e",
          userId: $userId
      }
    ){
      recordId,
      sessionId
    }
  }
`;

export const GET_ALL_MAGAZINE_LIST = gql`
query GetAllMag($size: Int!){
  getMagazinesList(
  franchiseId: null,
  eflyerId: null,
  magazineName: null,
  statusIds: null,
  companyIds: null,
  categoryIds: null,
  provinceIds: null,
  cityIds: null,
  suburbIds: null,
  page: 1,
  size: $size
  ){
  result{
  eflyerId,
  magazineName,
  eFlyerDescription,
  categoryID,
  categoryName,
  startDate,
  endDate,
  statusId,
  statusName,
  companyId,
  companyName,
  companyDescription,
  isMenu,
  streetAddress,
  countryID,
  countryName,
  provinceID,
  provinceName,
  cityID,
  cityName,
  suburbID,
  suburb,
  zipCode,
  phone,
  companyLocation
  mapEflyersUploadDtos{
  documentName
  }
  }
  }
  }

`;

export const GET_SPECIAL_BY_ID = gql`
query GetMstSpecialList($id: String!) {
  getMstSpecialList(
    specialId: null,
    specialName: null,
    franchiseId: null,
    statusIds: null,
    distance: null,
    companyIds: $id,
    categoryIds: null,
    provinceIds: null,
    cityIds: null,
    suburbIds: null,
    page: 1,
    size: 10
  ){
    count,
    currentPage,
    message,
    nextPage,
    prevPage,
    success,
    totalPages,
    result{
      amount,
      categoryID,
      categoryIds,
      categoryName,
      cityID,
      cityIds,
      cityName,
      companyIds,
      countryID,
      countryName,
      dis,
      distance,
      documentLink,
      endDate,
      franchiseId,
      imagePath,
      latitude,
      longitude,
      phone,
      provinceID,
      provinceIds,
      provinceName,
      specialDescription,
      specialId,
      specialID,
      specialName,
      staId,
      startDate,
      statusId,
      statusID,
      statusName,
      streetAddress,
      suburb,
      suburbID,
      suburbIds,
      userId,
      userLatitude,
      userLongtitude,
      zipCode
    }
  }
}`
  ;
export const GET_COMPANY_NAME = gql`
  query GetCompanyName($id: Int!) {
    getBusinessList(
     companyId: $id
     companyName: null
     franchiseeId: null,
     statusIds:"",
     categoryIds:null,
     provinceIds:"",
     cityIds:"",
     suburbIds:""
     page: 1,
     size: 10
   ){
     count,
     currentPage,
     message,
     nextPage,
     prevPage,
     success,
     totalPages,
     result{
       bEEScorePoint,
       bEEStatus,
       bEEStatusID,
       companyId,
       companyName,
       companyPercentage,
       companyStatus,
       companyStatusID,
       compCityID,
       compCityName,
       compCountryID,
       compCountryName,
       compDescription,
       compEmailId,
       compHelpDeskNumber,
       compPhone,
       compProvinceID,
       compProvinceName,
       compStreetAddress,
       compSuburb,
       compSuburbID,      
       compWebSite,
       directorsCount,
       franchiseId,
       intCompanyMBUDeviceID,
       intCompanyMBUDeviceType,
       intCompanyMBUEmail,
       intCompanyMBUName,
       joinDate,
       logoPath,
       procurementRecognition,
       serviceTax,
       vATNumber,
       zipCode
       
     }
     
   }
 }`
  ;

export const ADD_CUSTOMER_ENQUIRY = gql`
 mutation PostMstRating($title: String!,$companyId: Int!,$enquiryDescription: String!) {
  addCustomerEnquiry(
    customerEnquiry: {
      companyId:$companyId,  
      enquiryTitle:$title,
      enquiryDescription:$enquiryDescription
    }
  ){
    count,
    currentPage,
    message,
    nextPage,
    prevPage,
    success,
    totalPages,
    result
  }
}
`;

export const GET_BID_ALL_PRODUCT = gql`
query GetPrdProductList( $categories: String = null){
  getPrdProductList(
     productName: null,
     productId: null,
     categoryId: null,
     domainCategoryIds:$categories,
     status: null,
     salesTypeId: 2,
     scopeId:null,
     userId:null,
     page:1, size:50){
     count,
     currentPage,    
     message,
     nextPage,
     prevPage,
     success,
     totalPages,
     result{
       activeText,
       categoryID,
       categoryName,
       description,
       documentName,
       documentPath,
       isActive,
       ratingScore,
       productID,
       productImage,
       productName,
       productNumber,
       salesTypeId,
       typeID,
       inventory,
       clickCount,
       viewCount
       unitCost,
       length, 
       width, 
       height, 
       volume, 
       weight, 
       googleSchema,
       domainCategory, 
       startDate,
       endDate,
     mapProductImages{        
         imageName,
         imagePath
       }   
       prdBid{
         bidId,
         createdDate,
         bidAmount,
         userId
       }
       prdHire{
         hireId, 
         userId,
         isAccepted,
         fromDate, 
         toDate,
         returned
       }
      
     }
   }
 }`
  ;
export const BID_ON_PRODUCT = gql`
   mutation BidOnProduct($productId: Int,$amount: Decimal,$userId: Int) {
   createPrdBid(
    prdBid: {
        bidAmount:$amount,
        bidApprovedMail:false,
        bidId: 0,
        createdDate: null,
        isAccepted:true,
        isActive:true,
        modifiedBy:0,
        modifiedDate:null,
        productId:$productId,
        userId:$userId
    }
  ){
    bidId
  }
}
  `;


export const GET_ALL_HIRE_PRODUCT = gql`
query GetPrdProductList( $categories: String = null) {
  getPrdProductList(
     productName: null,
     productId: null,
     categoryId: null,
     domainCategoryIds:$categories,
     status: null,
     salesTypeId: 3,
     scopeId:null,
     userId:null,
     page:1, size:50){
     count,
     currentPage,    
     message,
     nextPage,
     prevPage,
     success,
     totalPages,
     result{
       activeText,
       categoryID,
       categoryName,
       description,
       documentName,
       documentPath,
       isActive,
       ratingScore,
       productID,
       productImage,
       productName,
       productNumber,
       salesTypeId,
       typeID,
       inventory,
       clickCount,
       viewCount
       unitCost,
       length, 
       width, 
       height, 
       volume, 
       weight, 
       googleSchema,
       domainCategory, 
       startDate,
       endDate,
     mapProductImages{        
         imageName,
         imagePath
       }   
       prdBid{
         bidId,
         createdDate,
         bidAmount,
         userId
       }
       prdHire{
         hireId, 
         userId,
         isAccepted,
         fromDate, 
         toDate,
         returned
       }
      
     }
   }
 }`
  ;
export const HIRE_THE_PRODUCT = gql`
    mutation HireTheProduct($productId: Int,$fromDate: DateTime,$toDate: DateTime,$userId: Int){
        postPrdShoppingCartOptimized(
          prdShoppingCart: {
            productId: $productId
            dateCreated: "2020-08-30T18:30:00.000"
            quantity: 1
            fromDate: $fromDate
            endDate: $toDate
            userId: $userId
          }
        ) {
          count
          currentPage
          message
          nextPage
          prevPage
          success
          totalPages
          result {
            prdShoppingCartDto {
              categoryID
              categoryName
              description
              productID
              productImage
              productName
              productNumber
              quantity
              recordID
              totalPrice
              unitCost
            }
            totalAmount,
            amountExlVat,
            vatAmount,
            recuringAmount
          }
        }
      }
      
 `;

export const HIRE_THE_PRODUCT_NULL = gql`
 mutation HireTheProductNew($productId: Int,$fromDate: DateTime,$toDate: DateTime){
  postPrdShoppingCartOptimized(
    prdShoppingCart: {
      productId: $productId
      dateCreated: "2020-08-30T18:30:00.000"
      quantity: 1
      fromDate: $fromDate
      endDate: $toDate
      userId: null
    }
  ) {
    count
    currentPage
    message
    nextPage
    prevPage
    success
    totalPages
    result {
      prdShoppingCartDto {
        categoryID
        categoryName
        description
        productID
        productImage
        productName
        productNumber
        quantity
        recordID
        totalPrice
        unitCost
      }
      totalAmount,
      amountExlVat,
      vatAmount,
      recuringAmount
    }
  }
}
`;

export const GET_PRODUCT_BY_CATEGORY_HOME = gql`
query GetPrdProductList(
  $size: Int
  $catId:Int
  ) {
  getPrdProductList(
    productName: null,
    productId: null,
    categoryId: $catId,
    domainCategoryIds:null,
    status: null,
    salesTypeId: 1,
    scopeId:1,
    userId:0,
    page:1, size:$size){
    count,
    currentPage,    
    message,
    nextPage,
    prevPage,
    success,
    totalPages,
    result{
      activeText,
      categoryID,
      categoryName,
      description,
      documentName,
      documentPath,
      isActive,
      ratingScore,
      productID,
      productImage,
      productName,
      productNumber,
      salesTypeId,
      typeID,
      inventory,
      clickCount,
      viewCount
      unitCost,
      length, 
      width, 
      height, 
      volume, 
      weight, 
      googleSchema,
      domainCategory, 
      startDate,
      endDate,
	  mapProductImages{        
        imageName,
        imagePath
      }   
      prdBid{
        bidId,
        createdDate,
        bidAmount,
        userId
      }
      prdHire{
        hireId, 
        userId,
        isAccepted,
        fromDate, 
        toDate,
        returned
      }
     
    }
  }
}
`;

export const CREATE_FAVOURITES_PRODUCT = gql`
mutation CreateFavourites($productId: Int,$createDate: DateTime,$userId: Int){
  createMstFavourites(
    mstFavourites: {
        companyId: null,
        createdBy: 0,
        createdDate: $createDate,
        eflyerId: null,
        modifiedBy: null,
        modifiedDate: null,
        mstFavouriteId: 0,
        productId: $productId,
        specialId: null,
        userId: $userId
    }
  ){
    mstFavouriteId
  }
}
`;

export const CREATE_FAVOURITES_SPECIAL = gql`
mutation CreateFavourites($productId: Int,$createDate: DateTime,$userId: Int){
  createMstFavourites(
    mstFavourites: {
        companyId: null,
        createdBy: 0,
        createdDate: $createDate,
        eflyerId: null,
        modifiedBy: null,
        modifiedDate: null,
        mstFavouriteId: 0,
        productId: null,
        specialId: $productId,
        userId: $userId
    }
  ){
    mstFavouriteId
  }
}
`;
export const REMOVE_FROM_CART = gql`
  mutation DeleteProduct($recordId: Int!) {
    deletePrdShoppingCart(
      prdShoppingCart: {
       recordId:$recordId
      }
    ) {
      count
      currentPage
      message
      nextPage
      prevPage
      success
      totalPages
      result {
        prdShoppingCartDto {
          categoryID
          categoryName
          description
          productID
          productImage
          productName
          productNumber
          quantity
          recordID
          totalPrice
          unitCost
        }
        totalAmount,
        amountExlVat,
        vatAmount,
        recuringAmount
      }
    }
  }
`;

export const purchaseShoppingCartAsync = gql`
query purchaseShoppingCartAsync($id: Int!) {
  purchaseShoppingCartAsync(
    id: $id,
  ){
    count,
    currentPage,
    message,
    nextPage,
    prevPage,
    success,
    totalPages,
    result{
      paymentUrl,
      paymentMethod
    }
  }
}`
  ;

export const SAVE_VEHICLE = gql`
  mutation MstVehicle(
    $userId: Int
    $registrationNumber: String
    $desc: String
    $engineNumber:String
    $date: DateTime
    $dateOfExpiry:DateTime
    $vin:String
    $make: String
  ) {
    postVehicle(
      mstVehicle: {
       vehicleID: 0,
       userID: $userId,
       engineNumber: $engineNumber,
       registrationNumber: $registrationNumber,
       make: $make,
       vIN: $vin,
       description: $desc,
       dateOfExpiry: $dateOfExpiry,
       createdDate: $date,
       sessionID: "d5c969fe-8f5d-4075-9620-7cfd414bd7b6"}) 
   {
     count,
     currentPage,
     message,
     nextPage,
     prevPage,
     success,
     totalPages,
     result{    
       vehicleID,
       make,  
       vIN,    
       engineNumber,
       description,      
       registrationNumber,
       sessionID, 
       userID, 
       createdDate          
       }
      }
 }
 
`;


export const GET_ALL_FAV_PRODUCT = gql`
{
  getMstFavouritesProductList(     
     page:1, size:10){
     count,
     currentPage,    
     message,
     nextPage,
     prevPage,
     success,
     totalPages,
     result{
       activeText,
       categoryID,
       categoryName,
       description,
       documentName,
       documentPath,
       isActive,
       ratingScore,
       productID,
       productImage,
       productName,
       productNumber,
       salesTypeId,
       typeID,
       inventory,
       clickCount,
       viewCount
       unitCost,
       length, 
       width, 
       height, 
       volume, 
       weight, 
       googleSchema,
       domainCategory, 
       startDate,
       endDate,
       companyID,
       mapProductImages{        
         imageName,
         imagePath
       }   
       prdBid{
         bidId,
         createdDate,
         bidAmount,
         userId
       }
       prdHire{
         hireId, 
         userId,
         isAccepted,
         fromDate, 
         toDate,
         returned
       }
      
     }
   }
 }`
  ;

export const GET_ALL_VEHICLE_DETAIL = gql`
  {
    getVehicles{     
       count,
       currentPage,
       message,
       nextPage,
       prevPage,
       success,
       totalPages,
       result{    
         vehicleID,
         make,  
         vIN,    
         engineNumber,
         description,       
         dateOfExpiry,
         registrationNumber,
         sessionID, 
         userID, 
         createdDate          
         }
        }
    }`
  ;

export const PACKAGE_LIST = gql`
  query {
      getMstPackageList(
          packageIds: null,
         includePackageIds: null,
         excludePackageIds: null,
         packageName: null,
         packageId: null,
          status:true){
         count,
         currentPage,
         message,
         nextPage,
         prevPage,
         success,
         totalPages,
         result{
           activeText,
           amount,
           isActive,
           isRecommended,
           packageID,
           packageName,
           recommendedText,
           sortOrder,
           threeMonths,
           sixMonths,
           twelveMonths,
           threeMonthsVat,
           sixMonthsVat,
           twelveMonthsVat,
           fiveDiscount,
           tenDiscount,
           fifteenDiscount,
           fiveOFF,
           tenOFF,
           fifteenOFF,
           zeroOFF,
         }
       }
     }
`;

export const PACKAGE_LIST_DETAIL = gql`
 { getMstPackageDetailList(
        packageId: null,
        status:true){
       count,
       currentPage,
       message,
       nextPage,
       prevPage,
       success,
       totalPages,
       result{
         activeText,
         actualValue,
         amount,
         attributeID,
         attributeName,
         isActive,
         packageDetailsID,
         packageID,
         pD_ActiveText,
         pD_isActive,
         sortOrder,
         value
       }
     }
   }
`;

export const ADD_ADDRESS = gql`
  mutation AddAddress(
    $userId: Int
    $curdate: DateTime
    $streetAddress: String
    $provinceID: Int
    $cityID:Int
    $suburbID: Int
    $longitude:String
    $latitude: String
    $zipCode:String
    ) {
      postUserAddress(
        mstUserAddress: {
         userAddressID: 0,
         userID: $userId,
         streetAddress:$streetAddress,
         countryID: 1,
         provinceID: $provinceID,
         cityID:$cityID,
         suburbID: $suburbID,
         zipCode: $zipCode,
         longitude:$longitude,
         latitude:$latitude
         createdDate: $curdate
        }) 
     {
       count,
       currentPage,
       message,
       nextPage,
       prevPage,
       success,
       totalPages,
       result{    
         userAddressID,
         userID,  
         streetAddress,    
         countryID,
         provinceID,      
         cityID,
         suburbID,
         zipCode, 
         longitude, 
         latitude,
         createdDate        
         }
        }
   }
   
`;

export const GET_ADDRESS_LIST = gql`
{
  getUserAddress{     
     count,
     currentPage,
     message,
     nextPage,
     prevPage,
     success,
     totalPages,
     result{    
       userAddressID,
       userID,  
       streetAddress,    
       countryID,
       provinceID,  
       province,    
       cityID,
       city,
       suburbID,
       suburb,
       zipCode, 
       longitude, 
       latitude          
       }
      }
  } 
`;

export const GET_USER_TOP_BIDS = gql`
{
  getUserTopBids(          
  page:1, size:100){
      count,
      currentPage,
      message,
      nextPage,
      prevPage,
      success,
      totalPages
      result{
        userID,
        firstName,
        lastName,
        email,
        status,
        userStatus,
        userProfileImage,
        userProfileThumbNailImage,
        bidAmount, 
        productID,
        orderID,
      }
  }
}
`

